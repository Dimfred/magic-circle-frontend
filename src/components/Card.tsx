import { Image } from "@mantine/core";
import { Flex, Card as MCard, Text, Tooltip } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";

import { CardOut } from "../backendClient";

interface CardProps {
  card: CardOut;
}

const Card = ({ card }: CardProps) => {
  const openScryfall = async () => {
    window.open(
      `https://scryfall.com/card/${card.scryfall_id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div>
      <MCard
        shadow="sm"
        h="18rem"
        w="13rem"
        onClick={openScryfall}
        style={{ cursor: "pointer" }}
      >
        <MCard.Section>
          <Image
            src={
              import.meta.env.VITE_BACKEND_URL + "/cards/" + card.scryfall_id
            }
          />
          <Tooltip label="quantity" withArrow openDelay={500}>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                backgroundColor: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {card.quantity}
            </div>
          </Tooltip>
          {card.foil && (
            <Tooltip label="foil" withArrow openDelay={500}>
              <IconStar
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  color: "gold",
                  width: "30px",
                  height: "30px",
                }}
              />
            </Tooltip>
          )}
        </MCard.Section>
      </MCard>
      <Flex justify="center">
        <Text fw={700} size="xs">
          {card.owner.username}
        </Text>
      </Flex>
    </div>
  );
};

export default Card;
