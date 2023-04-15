"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import MailIcon from "@mui/icons-material/Mail";
import DeleteIcon from "@mui/icons-material/Delete";
import Label from "@mui/icons-material/Label";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { Popover, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PopupItem from "../PopupItem";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type ActionButtonTreeItem = {
  labelIcon: React.ElementType<SvgIconProps>;
  labelText: string;
  onClick: () => void;
};

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  clickHandler: () => void;
  actionButtons?: ActionButtonTreeItem[];
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
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
  const [label, setLabel] = React.useState(props.labelText);

  const openedOptions = Boolean(anchorEl);

  useEffect(() => {
    setLabel(props.labelText);
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

  const keyPress = (e: any) => {
    if (e.keyCode == 13) {
      console.log("value", e.target.value);
      setEditingName(false);
    } else {
      setLabel(e.target.value);
    }
  };

  const openOptions = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const closeOptions = () => {
    setAnchorEl(null);
  };

  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    clickHandler,
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
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />

          {editingName ? (
            <>
              <TextField
                ref={textInputRef}
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={label}
                onClick={(e?: any) => e.stopPropagation()}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => keyPress(e)}
              />
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{ fontWeight: "inherit", flexGrow: 1 }}
            >
              {label}
            </Typography>
          )}

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
                    <PopupItem
                      labelIcon={EditIcon}
                      labelText={"Renombrar"}
                      onClick={(event?: any) => {
                        event.stopPropagation();
                        closeOptions();
                        setEditingName(true);
                      }}
                    />

                    {props.actionButtons?.map((actionButton, i) => {
                      return (
                        <PopupItem
                          labelIcon={actionButton.labelIcon}
                          labelText={actionButton.labelText}
                          onClick={(event?: any) => {
                            event.stopPropagation();
                            closeOptions();
                            actionButton.onClick();
                          }}
                        />
                      );
                    })}
                    <PopupItem
                      labelIcon={DeleteOutlineIcon}
                      labelText={"Delete"}
                      onClick={(event?: any) => {
                        event.stopPropagation();
                        closeOptions();
                        console.log("delete");
                      }}
                    />
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
