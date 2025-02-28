import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const ImageSlider = ({ response }) => {
    // Extract images and set them as sources with base64 encoding
    const imageSources = response.images.map(image => `data:image/png;base64,${image.image_data}`);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to handle slide change
    const handleSlideChange = (direction) => {
        setCurrentIndex((prevIndex) => {
            if (direction === 'next') {
                return (prevIndex + 1) % imageSources.length;
            } else {
                return (prevIndex - 1 + imageSources.length) % imageSources.length;
            }
        });
    };

    return (
        <Box 
            sx={{
                position: 'relative',
                maxWidth: '500px',
                margin: 'auto',
                overflow: 'hidden',
                borderRadius: '8px'
            }}
        >
            {/* Display the current image */}
            <Box
                component="img"
                src={imageSources[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                sx={{ width: '100%', display: 'block' }}
            />

            {/* Previous Button */}
            <IconButton
                onClick={() => handleSlideChange('prev')}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                }}
            >
                <ArrowBackIos />
            </IconButton>

            {/* Next Button */}
            <IconButton
                onClick={() => handleSlideChange('next')}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                }}
            >
                <ArrowForwardIos />
            </IconButton>
        </Box>
    );
};

export default ImageSlider;
