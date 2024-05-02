import {
  Checkbox,
  Chip,
  Fieldset,
  Flex,
  Group,
  Space,
  Text,
  Textarea,
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
  const [ignoreOwnedCards, setIgnoreOwnedCards] = useState<boolean>(false);
  const [exactMatch, setExactMatch] = useState<boolean>(false);
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
        <Text fw={700}>Users:</Text>
      </Flex>
      <Flex mt="xs" gap="2pt" wrap="wrap" justify="left">
        <Chip.Group multiple onChange={setSelectedUsernames}>
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
        <Text fw={700}>Options:</Text>
      </Flex>
      <Flex justify="left">
        <Checkbox.Group defaultValue={[]} withAsterisk>
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
              label="Match name exact"
              onChange={(event) => setExactMatch(event.currentTarget.checked)}
            />
          </Group>
        </Checkbox.Group>
      </Flex>
      <Space m="xl" />

      <Flex justify="left">
        <Text fw={700}>Decklist or URL to decklist:</Text>
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
