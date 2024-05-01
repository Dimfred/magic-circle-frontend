import { Button, Container, Notification, TextInput } from "@mantine/core";
import { IconLogin, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AxiosError, BackendError, backend } from "../backendClient";
import { useSession } from "../hooks/useSession";
import { routes } from "../routes";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const setSession = useSession();

  const handleLogin = async () => {
    if (username === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await backend.loginUser({
        username: username,
        password: password,
      });

      setUsername("");
      setPassword("");
      setSession(res.data.key);
      navigate(routes.main);
    } catch (e) {
      if ((e as AxiosError).response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError(
          `Failed to login, unknown error: ${(e as AxiosError).message}`,
        );
      }
    }
  };

  const handleRegister = async () => {
    if (username === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await backend.registerUser({
        username: username,
        password: password,
      });

      setUsername("");
      setPassword("");
      setSession(res.data.key);
      navigate(routes.main);
    } catch (e) {
      if ((e as AxiosError).response?.status === 400) {
        setError("Username already exists.");
      } else {
        setError(
          `Failed to login, unknown error: ${((e as AxiosError).response?.data as BackendError).detail}`,
        );
      }
    }
  };

  return (
    <Container size="xs" style={{ marginTop: "13rem" }}>
      <TextInput
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your username"
        required
        mt="sm"
      />

      <TextInput
        label="Password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        required
        mt="sm"
      />

      <Button
        onClick={handleLogin}
        leftSection={<IconLogin />}
        fullWidth
        style={{ marginTop: "20px" }}
      >
        Login
      </Button>

      <Button
        onClick={handleRegister}
        leftSection={<IconUser />}
        fullWidth
        style={{ marginTop: "20px" }}
      >
        Register
      </Button>

      {error && (
        <Notification color="red" mt="sm">
          {error}
        </Notification>
      )}
    </Container>
  );
};

export default Login;
