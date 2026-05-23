"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Timer() {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [allowOvertime, setAllowOvertime] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startTimer = () => {
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
    setIsOvertime(false);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;

        if (prev === 0 && allowOvertime) {
          setIsOvertime(true);
          return -1;
        }

        if (prev < 0 && allowOvertime) return prev - 1;

        clearInterval(interval);
        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, allowOvertime]);

  const formatTime = (t: number) => {
    const abs = Math.abs(t);

    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = abs % 60;

    // 👉 If no hours, show MM:SS only
    if (h === 0) {
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    // 👉 Otherwise HH:MM:SS
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      bgGradient="radial(gray.900, black)"
      color="white"
      px={6}
      textAlign="center"
    >
      {/* TITLE */}
      {
        !isFullscreen && (
          <Heading
            fontSize={{ base: "3xl", md: "5rem" }}
            mb={8}
            opacity={0.9}
            letterSpacing="wide"
          >
            Timer Countdown
          </Heading>
        )
      }


      {/* TIMER DISPLAY */}
      <Box
        fontSize={isFullscreen ? "25rem" : { base: "5xl", md: "10rem", lg: "15rem" }}
        fontWeight="extrabold"
        lineHeight="1"
        color={isOvertime ? "red.400" : "green.300"}
        mb={isFullscreen ? 12 : 8}
        transition="all 0.3s ease"
      >
        {formatTime(timeLeft)}
      </Box>

      {/* INPUTS (hidden in fullscreen mode) */}
      {!isFullscreen && (
        <VStack
          gap={6}
          p={6}
          borderRadius="2xl"
          bg="whiteAlpha.50"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          w="full"
          maxW="600px"
        >
          {/* TIME INPUTS */}
          <HStack gap={4} w="full">
            <Input
              placeholder="Hours"
              type="number"
              size="lg"
              textAlign="center"
              fontSize="xl"
              h="70px"
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _focus={{
                borderColor: "green.300",
                boxShadow: "0 0 0 1px rgba(72, 187, 120, 0.6)",
              }}
              onChange={(e) => setHours(Number(e.target.value || 0))}
            />

            <Input
              placeholder="Minutes"
              type="number"
              size="lg"
              textAlign="center"
              fontSize="xl"
              h="70px"
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _focus={{
                borderColor: "green.300",
                boxShadow: "0 0 0 1px rgba(72, 187, 120, 0.6)",
              }}
              onChange={(e) => setMinutes(Number(e.target.value || 0))}
            />

            <Input
              placeholder="Seconds"
              type="number"
              size="lg"
              textAlign="center"
              fontSize="xl"
              h="70px"
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _focus={{
                borderColor: "green.300",
                boxShadow: "0 0 0 1px rgba(72, 187, 120, 0.6)",
              }}
              onChange={(e) => setSeconds(Number(e.target.value || 0))}
            />
          </HStack>

          {/* BUTTONS */}
          <HStack gap={4} w="full" justify="center">
            <Button
              colorScheme="green"
              size="lg"
              px={10}
              fontSize="lg"
              fontWeight="bold"
              onClick={startTimer}
            >
              Start
            </Button>

            <Button
              colorScheme="yellow"
              size="lg"
              px={10}
              fontSize="lg"
              fontWeight="bold"
              onClick={() => setIsRunning(false)}
            >
              Pause
            </Button>

            <Button
              size="lg"
              px={10}
              fontSize="lg"
              borderColor="whiteAlpha.300"
              _hover={{ bg: "whiteAlpha.100" }}
              onClick={toggleFullscreen}
            >
              Fullscreen
            </Button>
          </HStack>

          {/* CHECKBOX */}
          <HStack gap={3} justify="center">
            <Checkbox.Root
              checked={allowOvertime}
              onCheckedChange={(details) =>
                setAllowOvertime(!!details.checked)
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control
                borderColor="whiteAlpha.400"
                _checked={{ bg: "red.400", borderColor: "red.400" }}
              />
              <Checkbox.Label fontSize="md" opacity={0.9}>
                Allow Overtime
              </Checkbox.Label>
            </Checkbox.Root>
          </HStack>
        </VStack>
      )}

      {/* FULLSCREEN EXIT BUTTON */}
      {isFullscreen && (
        <Box position="absolute" bottom="40px">
          <Button
            variant="outline"
            size="lg"
            opacity={0.7}
            _hover={{ opacity: 1 }}
            onClick={toggleFullscreen}
          >
            Exit Fullscreen
          </Button>
        </Box>
      )}
    </Flex>
  );
}