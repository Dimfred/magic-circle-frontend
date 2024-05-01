import { Container, Title } from "@mantine/core";

import AllCards from "./AllCards";

const MainPage = () => {
  return (
    <Container fluid>
      <Title>Magic Circle</Title>
      <br />
      <AllCards />
    </Container>
  );
};

export default MainPage;
