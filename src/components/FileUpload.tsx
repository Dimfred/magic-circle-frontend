import { Text, Tooltip, rem } from "@mantine/core";
import { Fieldset } from "@mantine/core";
import { Dropzone, FileRejection } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

import { UploadCardsFormatEnum, backend } from "../backendClient";
import { getSession } from "../hooks/useSession";

interface FileUploadProps {
  reloadCards: () => Promise<void>;
}

const FileUpload = ({ reloadCards }: FileUploadProps) => {
  const sizeRem = 52;
  const session = getSession();

  const uploadCards = async (files: File[]) => {
    for (const file of files) {
      await backend.uploadCards(UploadCardsFormatEnum.Manabox, file, session!);
    }
    await reloadCards();
  };

  return (
    <Fieldset legend="Upload Cards">
      <Tooltip
        label="Upload your manabox collection here. To upload a collection, go to manabox,
        hold the collection, tap on export. Then upload the exported Cards.csv here."
        w="25%"
        multiline
      >
        <Dropzone
          onDrop={(files: File[]) => uploadCards(files)}
          onReject={(files: FileRejection[]) =>
            console.log("Files have been rejected:", files)
          }
          maxSize={5 * 1024 ** 2}
          accept={["text/csv"]}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(sizeRem),
                height: rem(sizeRem),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(sizeRem),
                height: rem(sizeRem),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(sizeRem),
                height: rem(sizeRem),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Upload Cards.csv
            </Text>
          </div>
        </Dropzone>
      </Tooltip>
    </Fieldset>
  );
};

export default FileUpload;
