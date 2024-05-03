import { Container, Space, Title } from "@mantine/core";

import AllCards from "./AllCards";

const MainPage = () => {
  return (
    <Container fluid>
      <Title>Magic Circle</Title>
      <Space m="xl" />
      <AllCards />
    </Container>
  );
};

export default MainPage;
