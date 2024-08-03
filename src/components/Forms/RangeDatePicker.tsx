import React, { useState } from "react";
import { Box, Flex, Button, IconButton, Tooltip } from "@chakra-ui/react";
import { RiCalendar2Line, RiSearch2Line } from "react-icons/ri";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type RangeDate = {
  startDate: Date | null;
  endDate: Date | null;
};

interface RangeDatePickerProps {
  getRangeDate: ({ startDate, endDate }: RangeDate) => void;
  noSearch?: boolean;
  onChangeStart?: (start: Date | null) => void;
  onChangeEnd?: (end: Date | null) => void;
}

const calendarStyleProps = {
  right: 8,
  top: "40%",
  position: "absolute",
  transform: "translateY(-50%)",
};

export const RangeDatePicker = ({
  getRangeDate,
  onChangeStart,
  onChangeEnd,
  noSearch = false,
}: RangeDatePickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Flex>
      <Box position="relative" mr={2}>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);

            if (onChangeStart) onChangeStart(date);
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Data Início"
          className="chakra-datepicker-input"
        />
        <RiCalendar2Line
          size={20}
          color="gray.500"
          style={calendarStyleProps}
        />
      </Box>
      <Box position="relative" mr={2}>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);

            if (onChangeEnd) onChangeEnd(date);
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Data Fim"
          className="chakra-datepicker-input"
        />
        <RiCalendar2Line
          size={20}
          color="gray.500"
          style={calendarStyleProps}
        />
      </Box>

      {!noSearch && (
        <Tooltip label="Filtrar">
          <IconButton
            aria-label="Search database"
            bg="teal.400"
            icon={<RiSearch2Line color="white" />}
            onClick={() => {
              getRangeDate({ startDate, endDate });
              handleReset();
            }}
            _hover={{
              bg: "teal.500",
            }}
          />
        </Tooltip>
      )}
    </Flex>
  );
};
