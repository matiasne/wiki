import { Button, Popover } from "@mui/material";
import EmojiPicker, { Emoji, EmojiClickData } from "emoji-picker-react";
import { useState } from "react";

interface EmojiSelectorProps {
  default: string;
  onEmojiSelected: (emoji: string) => void;
}

export default function EmojiSelector(props: EmojiSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const opened = Boolean(anchorEl);

  const openSelector = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const closeOptions = () => {
    setAnchorEl(null);
  };

  const [emojiSelected, setEmojiSelected] = useState<EmojiClickData>();
  return (
    <>
      <Popover
        id={"1"}
        anchorEl={anchorEl}
        onClose={closeOptions}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        open={opened}
      >
        <EmojiPicker
          onEmojiClick={(data) => {
            console.log(data);
            setEmojiSelected(data);
            props.onEmojiSelected(data.unified);
            closeOptions();
          }}
        />
      </Popover>
      <Button onClick={openSelector}>
        <Emoji
          unified={emojiSelected ? emojiSelected.unified : props.default}
        />
      </Button>
    </>
  );
}
