import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Box, Flex, FormLabel, IconButton, Tooltip } from "@chakra-ui/react";
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

  onChangeDateStart?: (start: Date | null) => void;
  onChangeDateEnd?: (end: Date | null) => void;
}

const calendarStyleProps = {
  right: 8,
  top: "40%",
  position: "absolute",
  transform: "translateY(-50%)",
};

export const RangeDatePicker = forwardRef(
  (
    {
      getRangeDate,
      onChangeDateStart,
      onChangeDateEnd,
      noSearch = false,
    }: RangeDatePickerProps,
    ref
  ) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleReset = () => {
      setStartDate(null);
      setEndDate(null);
    };

    useImperativeHandle(ref, () => ({
      resetDates: handleReset,
    }));

    return (
      <Flex>
        <Box position="relative" mr={2}>

          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (onChangeDateStart) onChangeDateStart(date);
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
              if (onChangeDateEnd) onChangeDateEnd(date);
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
  }
);

RangeDatePicker.displayName = "RangeDatePicker";
