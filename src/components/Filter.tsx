import { Chip, Fieldset, Flex, Text, Textarea } from "@mantine/core";
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
}

////////////////////////////////////////////////////////////////////////////////
// INTERNAL
interface FilterProps {
  setFilterValues: (filter: FilterValues) => void;
}

const Filter = ({ setFilterValues }: FilterProps) => {
  const navigate = useNavigate();

  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [decklist, setDecklist] = useState<string>("");
  const session = getSession();

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
    });
  }, [selectedUsernames, decklist]);

  return (
    <Fieldset legend="Filter">
      <Flex justify="left">
        <Text>Users:</Text>
      </Flex>
      <Flex gap="2pt" wrap="wrap" justify="left">
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
      <br />
      <Flex justify="left">
        <Text>Decklist:</Text>
      </Flex>
      <Flex>
        <Textarea
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
