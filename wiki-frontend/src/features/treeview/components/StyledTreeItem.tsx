"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";

import { SvgIconProps } from "@mui/material/SvgIcon";
import { Button, Popover, TextField } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import PopupItem from "./PopupItem";
import nodeService from "../services/node.service";
import { Emoji } from "emoji-picker-react";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type ActionButtonTreeItem = {
  labelIcon: React.ElementType<SvgIconProps>;
  labelText: string;
  onClick: (event: any) => void;
};

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  emojiUnified: any;
  labelInfo?: string;
  labelText: string;
  clickHandler: () => void;
  actionbuttons?: ActionButtonTreeItem[];
  onEmojiClick: (event: any) => void;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-selected": {
      backgroundColor: "transparent",
    },
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

export default function StyledTreeItem(props: StyledTreeItemProps) {
  const textInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [hover, setHover] = React.useState(false);
  const [editingName, setEditingName] = React.useState(false);
  const [editingLabel, setEditingLabel] = React.useState(props.labelText);

  const openedOptions = Boolean(anchorEl);

  useEffect(() => {
    setEditingLabel(props.labelText);
  }, [props.labelText]);

  useOutsideAlerter(textInputRef);

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setEditingName(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  const keyPress = async (e: any) => {
    if (e.keyCode == 13) {
      setEditingName(false);

      let resp = await nodeService.update(props.nodeId, {
        name: e.target.value,
      });
    } else {
      setEditingLabel(e.target.value);
    }
  };

  const openOptions = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const closeOptions = (e: any) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const {
    bgColor,
    color,
    emojiUnified,
    labelInfo,
    labelText,
    clickHandler,
    onEmojiClick,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
            cursor: "pointer",
          }}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onClick={() => clickHandler()}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEmojiClick(e);
            }}
          >
            <Emoji
              unified={props.emojiUnified ? props.emojiUnified : "1f4c1"}
            />
          </Button>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "inherit",
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEmojiClick(e);
            }}
          >
            {props.labelText}
          </Typography>

          <>
            {hover && !editingName ? (
              <>
                <Box
                  aria-describedby={"1"}
                  component={MoreHorizIcon}
                  color="inherit"
                  sx={{ mr: 0 }}
                  onClick={openOptions}
                />
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
                  open={openedOptions}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      p: 0.5,
                      pr: 0,
                      width: "150px",
                    }}
                  >
                    {props.actionbuttons?.map((actionButton, i) => {
                      return (
                        <PopupItem
                          key={i}
                          labelIcon={actionButton.labelIcon}
                          labelText={actionButton.labelText}
                          onClick={(event?: any) => {
                            event.stopPropagation();
                            closeOptions(event);
                            actionButton.onClick(event);
                          }}
                        />
                      );
                    })}
                  </Box>
                </Popover>
              </>
            ) : null}
          </>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}
