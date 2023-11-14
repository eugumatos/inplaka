import { useRef } from "react";
import {
  Box,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  FocusLock,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEye2Line } from "react-icons/ri";

export const PopoverPlaqueForm = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton
          aria-label=""
          size="md"
          bg="blue.200"
          icon={<RiEye2Line color="#fff" />}
        />
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
