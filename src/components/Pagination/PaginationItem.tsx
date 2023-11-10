import { Button } from "@chakra-ui/button";

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  isCurrent,
  onPageChange,
  number,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        bg="gray.300"
        color="gray.200"
        disabled
        _hover={{
          bg: "gray.300",
          cursor: "not-allowed",
        }}
      >
        {number}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      width="4"
      color="gray.200"
      bg="blue.200"
      _hover={{
        bg: "blue.100",
      }}
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  );
}
