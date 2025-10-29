"use client";

import { useState } from "react";
import {
  Button,
  Stack,
  Paper,
  Title,
  Text,
  Code,
  Image,
  Group,
} from "@mantine/core";

interface DogApiResponse {
  message: string;
  status: string;
}

export function ApiFetcher() {
  const [dogData, setDogData] = useState<DogApiResponse | null>(null);
  const [httpCode, setHttpCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomHttpCode = (): number => {
    const httpCodes = [
      100, 101, 200, 201, 202, 203, 204, 206, 207, 300, 301, 302, 303, 304, 305,
      307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412,
      413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 429, 431, 451,
      500, 501, 502, 503, 504, 506, 507, 508, 509, 510, 511,
    ];
    return httpCodes[Math.floor(Math.random() * httpCodes.length)];
  };

  const fetchApis = async () => {
    setIsLoading(true);
    try {
      const dogResponse = await fetch(
        "https://dog.ceo/api/breeds/image/random"
      );
      const dogJson: DogApiResponse = await dogResponse.json();
      setDogData(dogJson);

      const randomCode = getRandomHttpCode();
      setHttpCode(randomCode);
    } catch (error) {
      console.error("Error fetching APIs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Button onClick={fetchApis} loading={isLoading} size="lg">
        Fetch APIs
      </Button>

      {dogData && (
        <Paper shadow="sm" p="md" radius="md">
          <Title order={3} mb="md">
            Dog API Response
          </Title>

          <Text fw={500} mb="xs">
            JSON Response:
          </Text>
          <Code block mb="md">
            {JSON.stringify(dogData, null, 2)}
          </Code>

          <Text fw={500} mb="xs">
            Image:
          </Text>
          <Image
            src={dogData.message}
            alt="Random dog"
            radius="md"
            h={400}
            w="auto"
            fit="contain"
          />
        </Paper>
      )}

      {httpCode !== null && (
        <Paper shadow="sm" p="md" radius="md">
          <Title order={3} mb="md">
            HTTP Dog (Code: {httpCode})
          </Title>

          <Group align="flex-start" gap="md">
            <div style={{ flex: 1 }}>
              <Text fw={500} mb="xs">
                URL:
              </Text>
              <Code block mb="md">
                https://http.dog/{httpCode}.jpg
              </Code>
            </div>
          </Group>

          <Text fw={500} mb="xs">
            Image:
          </Text>
          <Image
            src={`https://http.dog/${httpCode}.jpg`}
            alt={`HTTP status ${httpCode}`}
            radius="md"
            h={400}
            w="auto"
            fit="contain"
          />
        </Paper>
      )}
    </Stack>
  );
}
