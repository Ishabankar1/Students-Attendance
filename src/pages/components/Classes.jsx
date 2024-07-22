import { Box, Button, FormGroup, Paper, TablePagination, Typography } from '@mui/material';

import TextField from '@mui/material/TextField/TextField';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { addClass, getClasses } from 'src/services/classes/class.service';

const ClassSection = () => {
  const [classPage, classPageChange] = useState(0);
  const [classRowPerPage, classRowPerPageChange] = useState(6);
  const [classdata, setClassData] = useState([0]);
  const [cardsUpdates, setCardsUpdates] = useState(true);

  useEffect(() => {
    fetchApi();
  }, [cardsUpdates]);

  const fetchApi = async () => {
    const getData = await getClasses();
    setClassData(getData);
  };

  const handlechangepage = (event, newpage) => {
    classPageChange(newpage);
  };

  const handleRowsPerPage = (event) => {
    classRowPerPageChange(+event.target.value);
    classPageChange(0);
  };

  function generateLightColor() {
    const minBrightness = 150;
    const randomRed = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    const randomGreen = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    const randomBlue = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    return 'rgb(' + randomRed + ',' + randomGreen + ',' + randomBlue + ')';
  }

  const colors = ['#ffb8ac', '#ff93ea', '#7fd0fb', '#4befda', '#ff91ae', '#ffcba0', '#7eeb9a', '#ffd778', '#feb7ab'];

  function getRandomColor() {
    if (colors?.length > 0) {
      const randomIndex = Math.floor(Math.random() * colors?.length);
      return colors[randomIndex];
    } else {
      return generateLightColor();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const payload = {
      ...data
    };
    const response = await addClass(payload);
    // response?.status === 201
    //   ? enqueueSnackbar('Class Successfully Created !', { variant: 'success' })
    //   : enqueueSnackbar('Class Not Created !', { variant: 'error' });

    setCardsUpdates(!cardsUpdates);
  };

  const [anchorEls, setAnchorEls] = useState({});
  const open = Boolean(anchorEls);
  const handleAnchorClick = (id, event) => {
    setAnchorEls((prevAnchorEls) => ({
      ...prevAnchorEls,
      [id]: event.currentTarget
    }));
  };

  const handleAnchorClose = (id) => {
    setAnchorEls((prevAnchorEls) => ({
      ...prevAnchorEls,
      [id]: null
    }));
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          padding: '20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h3" component="h1" paragraph>
          Class Section
        </Typography>
        <Box
          sx={{
            maxWidth: '100%',
            margin: 1,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Box
            id="main-class-section"
            sx={{
              border: '1 solid black',
              borderRadius: 5,
              boxShadow: '1px 2px 4px #BEBEC2',
              padding: '2%',
              height: '30%',
              margin: 2,
              marginLeft: 1
            }}
          >
            <Typography variant="h4" component="h1" paragraph>
              Create Class
            </Typography>
            <FormGroup>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  id="classname"
                  label="Class Name"
                  className="text-field"
                  size="medium"
                  variant="outlined"
                  sx={{ margin: 2, width: '90% !important' }}
                  name="classname"
                  required
                />
                <TextField
                  id="classroom"
                  label="Class Room No"
                  className="text-field"
                  size="medium"
                  variant="outlined"
                  sx={{ margin: 2, width: '90% !important' }}
                  name="classroom"
                  required
                />
                <TextField
                  id="description"
                  size="medium"
                  className="text-field"
                  label="Description"
                  rows={2}
                  multiline={true}
                  sx={{ margin: 2, width: '90% !important' }}
                  variant="outlined"
                  name="description"
                  required
                />
                <Button variant="contained" size="medium" sx={{ width: '30%', marginLeft: '30%' }} type="submit" id="submit-btn">
                  Add Class
                </Button>
              </form>
            </FormGroup>
          </Box>
          <Box
            sx={{
              width: '90vw',
              padding: 3,
              height: '100%',
              border: '1 solid black',
              borderRadius: 5,
              margin: 0.5,
              boxShadow: '1px 2px 4px #BEBEC2'
            }}
          >
            <Typography variant="h4" component="h1" paragraph>
              Classes
            </Typography>
            <Paper>
              <Box
                className="container"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  width: '100%',
                  height: '95%'
                }}
              >
                {classdata?.slice(classPage * classRowPerPage, classPage * classRowPerPage + classRowPerPage)?.map((data, index) => (
                  <Box
                    className="card"
                    id="card"
                    sx={{
                      width: '10rem',
                      height: '35%',
                      borderRadius: '20px',
                      backgroundColor: getRandomColor(),
                      position: 'relative',
                      padding: '0.8rem',
                      border: '2px solid #c3c6ce',
                      transition: '0.5s ease- out',
                      overflow: 'visible',
                      margin: '23px 10px 15px 15px',
                      '&:hover': {
                        borderColor: '#008bf8',
                        boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)'
                      }
                    }}
                    key={data.parentId}
                  >
                    <Box
                      className="cardDetails"
                      sx={{
                        color: 'black',
                        height: '100%',
                        gap: '.1rem',
                        display: 'grid',
                        placeContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {data.classname}
                      </Typography>
                      <Typography
                        sx={{
                          textAlign: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {data.classroom}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={classdata?.length}
                rowsPerPage={classRowPerPage}
                page={classPage}
                onPageChange={handlechangepage}
                onRowsPerPageChange={handleRowsPerPage}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClassSection;
