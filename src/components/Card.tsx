import { Image } from "@mantine/core";
import { Card as MCard, Text } from "@mantine/core";

import { CardOut } from "../backendClient";

interface CardProps {
  card: CardOut;
}

const Card = ({ card }: CardProps) => {
  return (
    <div>
      <MCard shadow="sm" h="18rem" w="13rem">
        <MCard.Section>
          <Image
            src={
              import.meta.env.VITE_BACKEND_URL + "/cards/" + card.scryfall_id
            }
          />
        </MCard.Section>
      </MCard>
      <Text size="xs">
        Owner: {card.owner.username} | Quantity: {card.quantity} | Foil:{" "}
        {card.foil.toString()}
      </Text>
    </div>
  );
};

export default Card;
