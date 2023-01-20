import React from 'react';
import { Box } from '@mui/material';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

const InfiniteWrapper = ({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
}) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => ({}) : loadNextPage;
  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      content = items[index];
    }

    return <Box sx={style}>{content}</Box>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={150}
          itemCount={itemCount}
          itemSize={30}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={300}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
};

export default InfiniteWrapper;
