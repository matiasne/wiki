"use client";
import { Box, SvgIconProps, Typography, styled } from "@mui/material";

type PopupItemProps = {
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  onClick: () => void;
};

const StyledBox = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function PopupItem(props: PopupItemProps) {
  const { labelIcon, labelInfo, labelText, onClick, ...other } = props;

  return (
    <StyledBox
      sx={{
        display: "flex",
        flexDirection: "row",
        verticalAlign: "middle",
        alignItems: "left",
        p: 0.5,
        pr: 0,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Box component={labelIcon} color="inherit" sx={{ mr: 1 }}></Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: "inherit",
          flexGrow: 1,
          lineHeight: 1.9,
        }}
      >
        {labelText}
      </Typography>
    </StyledBox>
  );
}
