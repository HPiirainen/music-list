import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Switch,
    Typography,
} from '@material-ui/core';
import ListSwitch from './ListSwitch';

const styles = theme => ({

});

const GenreFilter = props => {
    const { genres, activeGenres, genreSetter } = props;

    const [allSelected, setAllSelected] = useState(true);

    useEffect(() => {
        if (activeGenres.length === 0) {
            // Check select all if no genres checked
            toggleSelectAll(true);
        } else {
            // Otherwise keep unchecked
            toggleSelectAll(false);
        }
    }, [activeGenres]);

    useEffect(() => {
        // If select all was checked, empty checked genres
        if (allSelected) {
            genreSetter([]);
        }
    }, [allSelected]);

    const toggleSelectAll = state => {
        setAllSelected(state);
    }

    const switchGenre = (state, genre) => {
        let genres;
        if (state) {
            genres = [...activeGenres, genre];
        } else {
            genres = [...activeGenres].filter(g => g !== genre);
        }
        genreSetter(genres);
    }

    const listItems = genres.map((genre, index) => {
        const genreIsActive = activeGenres.includes(genre);
        return (
            <ListSwitch
                key={index}
                label={genre}
                identifier={index}
                isChecked={genreIsActive}
                onSwitch={switchGenre}
            />
        );
    });

    return (
        <>
            <List subheader={<ListSubheader disableSticky>Genres</ListSubheader>}>
                <ListSwitch
                    key="select-all"
                    label="Show all"
                    identifier="select-all"
                    isChecked={allSelected}
                    onSwitch={toggleSelectAll}
                />
                { listItems }
            </List>
        </>
    )
}

GenreFilter.propTypes = {
    genres: PropTypes.array,
    activeGenres: PropTypes.array,
    genreSetter: PropTypes.func,
};

export default withStyles(styles)(GenreFilter);