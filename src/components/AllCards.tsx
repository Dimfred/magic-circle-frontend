import { Flex, Grid, Text } from "@mantine/core";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

import {
  CardOut,
  CardsGetInDecklistFormatEnum,
  backend,
} from "../backendClient";
import { getSession } from "../hooks/useSession";
import { routes } from "../routes";
import Card from "./Card";
import FileUpload from "./FileUpload";
import Filter, { FilterValues } from "./Filter";

const AllCards = () => {
  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////////////////////
  // CARDS
  const [cards, setCards] = useState<CardOut[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const session = getSession();

  const [filterValues, setFilterValues] = useState<FilterValues>({
    usernames: [],
    decklist: "",
    decklist_format: "plain",
    ignore_owned_cards: false,
    exact_match: false,
  });

  const loadMoreCards = async () => {
    try {
      if (session === null) {
        navigate(routes.root);
        return;
      }

      if (!hasMore) {
        return;
      }

      if (filterValues.usernames.length == 0) {
        return;
      }

      const res = await backend.getCards(
        {
          usernames: filterValues.usernames,
          decklist: filterValues.decklist,
          decklist_format: CardsGetInDecklistFormatEnum.Plain,
          ignore_owned_cards: filterValues.ignore_owned_cards,
          exact_match: filterValues.exact_match,
          page: page,
          max_page: 50,
        },
        session,
      );

      setPage(page + 1);
      setCards((prevCards) => [...prevCards, ...res.data]);

      if (res.data.length === 0) {
        setHasMore(false);
        return;
      }
    } catch (e) {
      if ((e as AxiosError).status === 401) {
        navigate(routes.root);
        localStorage.removeItem("sessionKey");
      }
    }
  };

  useEffect(() => {
    loadMoreCards();
  }, [filterValues]);

  ////////////////////////////////////////////////////////////////////////////////
  // FILTER
  const onFilterValuesChanged = (filterValues: FilterValues) => {
    // why typescript are you so fucking retarded
    // console.log("ISSAME:", v === filterValues);
    // console.log(v, filterValues);
    // if (v === filterValues) {
    //   return;
    // }

    setPage(0);
    setHasMore(true);
    setCards([]);
    setFilterValues(filterValues);
  };

  return (
    <Grid>
      <Grid.Col span={3}>
          <FileUpload
            reloadCards={async () => {
              setTimeout(() => {
                setPage(0);
                setHasMore(true);
                setCards([]);
                setFilterValues(filterValues);
              }, 2000);
            }}
          />
        <Filter setFilterValues={onFilterValuesChanged}></Filter>
      </Grid.Col>
      <Grid.Col span={9}>
        <InfiniteScroll
          dataLength={cards.length}
          next={loadMoreCards}
          hasMore={hasMore}
          loader=""
          endMessage=""
        >
          <Flex
            gap="xs"
            wrap="wrap"
            justify={cards.length !== 0 ? "left" : "center"}
          >
            {cards.length !== 0 ? (
              cards.map((card, idx) => <Card card={card} key={idx} />)
            ) : (
              <Text>No results</Text>
            )}
          </Flex>
        </InfiniteScroll>
      </Grid.Col>
    </Grid>
  );
};

export default AllCards;
