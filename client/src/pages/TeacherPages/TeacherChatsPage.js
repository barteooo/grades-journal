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

const TeacherChatsPage = () => {
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

      const allUsers = result.users.filter((x) => x._id !== userId);
      setUsers([...allUsers]);
    };

    initUsers();
  }, []);

  useEffect(() => {
    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  useEffect(() => {
    messagesContainerRef.current.scrollTo(
      0,
      messagesContainerRef.current.scrollHeight
    );
  }, [messages]);

  const onMessage = (message) => {
    console.log(message);
    setMessages((m) => [...m, message]);
  };

  const initMessages = async (selectedUserId) => {
    setMessages([]);

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
    };

    setMessages([...messages, message]);
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
        style={{ height: 400, overflow: "scroll" }}
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
                    <p style={{ textAlign: "right" }}>{message.text}</p>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </Col>
              </Row>
            );
          })}
      </Container>
      <div>
        <Form onSubmit={handleSubmitMessage}>
          <Form.Group>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
          </Form.Group>
          <Button type="submit">Wyślij</Button>
        </Form>
      </div>
    </div>
  );
};

export default TeacherChatsPage;
