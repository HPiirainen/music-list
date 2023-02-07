import React, { PropsWithChildren } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface MusicListProps {
  title: string;
  description?: string;
}

const MusicList: React.FC<PropsWithChildren<MusicListProps>> = ({
  title,
  description,
  children,
}) => {
  const theme = useTheme();
  console.log('rendering MusicList', title);

  // const [hasNextPage, setHasNextPage] = useState(true);
  // const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  // const [items, setItems] = useState(list.items);

  // const loadMore = () => {
  //   // TODO:
  //   // Infinite loader,
  //   // load the active list only at first,
  //   // load other lists when tab is opened.
  // };

  return (
    <Box my={2}>
      <Typography
        variant="h2"
        sx={{ textAlign: 'center', marginBottom: theme.spacing(1.5) }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: 'center', marginBottom: theme.spacing(1.5) }}
      >
        {description}
      </Typography>
      {children}
    </Box>
  );
};

export default MusicList;
