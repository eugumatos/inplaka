import { useState, useRef } from "react";
import { Tooltip, IconButton, Heading, Text, Progress } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import * as XLSX from "xlsx";

import { ModalDialog } from "@/components/Modals";

type UploadFileProps = {
  onParsedData: (parsedData: any) => void;
  isDisabled?: boolean;
};

export function UploadFile({ onParsedData, isDisabled }: UploadFileProps) {
  const fileUploadButtonRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (!e.target.files) return;

    reader.readAsBinaryString(e.target?.files[0]);
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: any = XLSX.utils.sheet_to_json(sheet);

      onParsedData(parsedData);

      if (fileUploadButtonRef.current?.value)
        fileUploadButtonRef.current.value = "";
    };
  };

  /*
  const ModalImport = () => {
    return (
      <ModalDialog
        maxWidth="35%"
        textAction="Importar"
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onAction={() => {}}
      >
        <Heading size="md">Deseja importar este arquivo?</Heading>

        <Text mt={8}>{selectedFile?.name}</Text>

        <Progress size="xs" mt={3} value={0} isIndeterminate />
      </ModalDialog>
    );
  };
  */

  return (
    <div>
      <input
        type="file"
        id="icon-button-file"
        ref={fileUploadButtonRef}
        style={{ visibility: "hidden", width: 0 }}
        onChange={handleFileUpload}
        accept=".xlsx"
      />
      <Tooltip label="Importar arquivo">
        <IconButton
          isDisabled={isDisabled}
          aria-label="Search database"
          bg="purple.400"
          icon={<LuUpload color="white" />}
          onClick={() => fileUploadButtonRef.current?.click()}
          _hover={{
            bg: "purple.500",
          }}
        />
      </Tooltip>

      {/* !!selectedFile && <ModalImport /> */}
    </div>
  );
}
