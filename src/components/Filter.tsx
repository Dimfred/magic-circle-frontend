import {
  Checkbox,
  Chip,
  Fieldset,
  Flex,
  Group,
  Space,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { backend } from "../backendClient";
import { getSession } from "../hooks/useSession";
import { routes } from "../routes";

////////////////////////////////////////////////////////////////////////////////
// EXTERNAL
export interface FilterValues {
  usernames: string[];
  decklist: string;
  decklist_format: string;
  ignore_owned_cards: boolean;
  exact_match: boolean;
}

////////////////////////////////////////////////////////////////////////////////
// INTERNAL
interface FilterProps {
  setFilterValues: (filter: FilterValues) => void;
}

const Filter = ({ setFilterValues }: FilterProps) => {
  const navigate = useNavigate();
  const session = getSession();

  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [ignoreOwnedCards, setIgnoreOwnedCards] = useState<boolean>(true);
  const [exactMatch, setExactMatch] = useState<boolean>(true);
  const [decklist, setDecklist] = useState<string>("");

  const loadUsers = async () => {
    if (session === null) {
      navigate(routes.root);
      return;
    }

    try {
      const usernames_ = (await backend.getAllUsers(session)).data.map(
        (user) => user.username,
      );
      setAllUsernames(usernames_);
      setSelectedUsernames(usernames_);
    } catch (e) {
      if ((e as AxiosError).response?.status === 401) {
        navigate(routes.root);
        localStorage.removeItem("sessionKey");
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setFilterValues({
      usernames: selectedUsernames,
      decklist: decklist,
      decklist_format: "plain",
      ignore_owned_cards: ignoreOwnedCards,
      exact_match: exactMatch,
    });
  }, [selectedUsernames, decklist, ignoreOwnedCards, exactMatch]);

  return (
    <Fieldset legend="Filter">
      <Flex justify="left">
        <Tooltip
          label="Allows to select the users from whom you want to see cards."
          multiline
          w="25%"
          openDelay={500}
        >
          <Text fw={700}>Users:</Text>
        </Tooltip>
      </Flex>
      <Flex mt="xs" gap="2pt" wrap="wrap" justify="left">
        <Chip.Group
          multiple
          onChange={setSelectedUsernames}
          value={selectedUsernames}
        >
          {allUsernames.map((username) => (
            <Chip
              value={username}
              key={username}
              checked={selectedUsernames.includes(username)}
            >
              {username}
            </Chip>
          ))}
        </Chip.Group>
      </Flex>
      <Space m="xl" />

      <Flex justify="left">
        <Tooltip
          label="Ignore cards I own: will ignore the cards you own, meaning it won't show a card you search for
          from other people. Exact name: if enabled will match the name exact, else a partial match is applied,
            having Exact Match disabled and Ignore cards I own enabled can lead to errors."
          multiline
          w="25%"
          openDelay={500}
        >
          <Text fw={700}>Options:</Text>
        </Tooltip>
      </Flex>
      <Flex justify="left">
        <Checkbox.Group defaultValue={["exactMatch", "ignoreOwnedCards"]}>
          <Group mt="xs">
            <Checkbox
              value="ignoreOwnedCards"
              label="Ignore cards I own"
              onChange={(event) =>
                setIgnoreOwnedCards(event.currentTarget.checked)
              }
            />
            <Checkbox
              value="exactMatch"
              label="Exact name"
              onChange={(event) => setExactMatch(event.currentTarget.checked)}
            />
          </Group>
        </Checkbox.Group>
      </Flex>
      <Space m="xl" />

      <Flex justify="left">
        <Tooltip
          label="This allows you to parse a decklist, either from text, or you can also put in an URL to a decklist,
          supported websites are: aetherhub.com, archidekt.com, deckstats.net, moxfield.com, mtggoldfish.com, scryfall.com,
        tappedout.net, tcgplayer.com."
          multiline
          w="25%"
          openDelay={500}
        >
          <Text fw={700}>Decklist or URL to decklist:</Text>
        </Tooltip>
      </Flex>
      <Flex>
        <Textarea
          mt="xs"
          w="100%"
          autosize
          placeholder="your decklist..."
          onChange={(event) => setDecklist(event.currentTarget.value)}
        />
      </Flex>
    </Fieldset>
  );
};

export default Filter;
