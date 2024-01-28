import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UsersApi from "../../api/UsersApi";
import AuthService from "../../services/AuthService";
import socket from "../../sockets";
import ChatsApi from "../../api/ChatsApi";

const StudentChatsPage = () => {
  const messagesContainerRef = useRef();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const initUsers = async () => {
      const userId = AuthService.getUserId();

      const result = await UsersApi.getAllUsers();
      if (!result.success) {
        alert("Błąd pobiearnia uzytkowników!");
        return;
      }

      const allUsers = result.users.filter(
        (x) => x._id !== userId && x.role !== "admin"
      );
      setUsers([...allUsers]);
    };

    initUsers();
  }, []);

  useEffect(() => {
    socket.on("message", onMessage);
    socket.on("delivered", delivered);

    return () => {
      socket.off("message", onMessage);
      socket.off("delivered", delivered);
    };
  }, []);
  // selectedUserId bo WebSocket przechowuje pierwotny stan i po zmienieniu uytkownika
  //będzie pamiętać pierwszego

  useEffect(() => {
    messagesContainerRef.current.scrollTo(
      0,
      messagesContainerRef.current.scrollHeight
    );
  }, [messages]);

  const onMessage = (message) => {
    setMessages((e) => [...e, message]);
  };

  const delivered = (message) => {
    setMessages((e) => [...e, message]);
    // setSelectedUserId((e) => e);
    // initMessages(selectedUserId);
  };
  //alternatywne podejście, e zamiast robić init mozemy odswiezyc
  //wiadomości przekazując ostatni stan aby wszystkie wiadomości
  //trafiły tam bo websocket przechowuje pierwszy(pierwotny stan)

  const initMessages = async (selectedUserId) => {
    if (!selectedUserId) {
      return;
    }

    const userId = AuthService.getUserId();
    const result = await ChatsApi.getChat(userId, selectedUserId);
    if (!result.success) {
      alert("Błąd pobiearnia uzytkowników!");
      return;
    }

    if (!result.chat) {
      setMessages([]);
      return;
    }
    setMessages([...result.chat.messages]);
  };

  const handleChangeSelectedUser = (e) => {
    setSelectedUserId(e.target.value);
    initMessages(e.target.value);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      return;
    }

    const message = {
      userId: AuthService.getUserId(),
      text: messageText,
      date: new Date(),
    };

    setMessageText("");

    socket.emit("message", { text: messageText, reciverId: selectedUserId });
  };

  return (
    <div>
      <div>
        <Form.Select value={selectedUserId} onChange={handleChangeSelectedUser}>
          <option value="">Wybierz uzytkownika</option>
          {users.map((user, index) => {
            return (
              <option key={index} value={user._id}>
                {user.email}
              </option>
            );
          })}
        </Form.Select>
      </div>

      <Container
        ref={messagesContainerRef}
        fluid
        style={{ height: 600, overflow: "scroll" }}
      >
        {messages
          .filter(
            (message) =>
              message.userId === selectedUserId ||
              message.userId === AuthService.getUserId()
          )
          .map((message, index) => {
            return (
              <Row key={index}>
                <Col>
                  {message.userId !== selectedUserId ? (
                    <p
                      style={{
                        textAlign: "right",
                        marginBottom: 30,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span style={{ fontWeight: "bolder", fontSize: 15 }}>
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                      <span>{message.text}</span>
                    </p>
                  ) : (
                    <p
                      style={{
                        textAlign: "left",
                        marginBottom: 30,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span style={{ fontWeight: "bolder", fontSize: 15 }}>
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                      <span>{message.text}</span>
                    </p>
                  )}
                </Col>
              </Row>
            );
          })}
      </Container>
      <div>
        <Form onSubmit={handleSubmitMessage}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Form.Group>
              <textarea
                style={{ width: "100%", height: 100, fontSize: "20px" }}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              ></textarea>
            </Form.Group>
            <Button
              type="submit"
              style={{
                width: "100%",
                maxWidth: "200px",
                alignSelf: "end",
              }}
            >
              Wyślij
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default StudentChatsPage;
