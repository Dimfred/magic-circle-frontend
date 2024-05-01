import { Container, Title } from "@mantine/core";

import { useSession } from "../hooks/useSession";
import LoginRegister from "./LoginRegister";

const App = () => {
  useSession();

  return (
    <Container size="sm" style={{ padding: "40px 0" }}>
      <Title order={1}>Magic Circle Cadene Findne</Title>
      <LoginRegister />
    </Container>
  );
};

export default App;
