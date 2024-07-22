import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TablePagination,
  Tooltip,
  Typography
} from '@mui/material';

import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet-async';
import { getSubjects, addSubjects, deleteSubject, updateSubject } from 'src/services/subjects/subjects.service';

const Subjects = () => {
  const [classPage, classPageChange] = useState(0);
  const [classRowPerPage, classRowPerPageChange] = useState(6);
  const [cardsUpdates, setCardsUpdates] = useState(true);
  const [subjectData, setSubjectData] = useState([]);
  const [deleteFormPopup, setDeleteFormPopup] = useState(false);
  const [deleteSubjectID, setDeleteSubjectID] = useState();
  const [editFormPopup, setEditFormPopup] = useState(false);
  const [editSubjectDetail, setEditSubjectDetail] = useState({
    subject: '',
    description: '',
    _id: ''
  });
  const [subject, setSubject] = useState({
    subject: '',
    description: ''
  });

  useEffect(() => {
    fetchApi();
  }, [cardsUpdates, deleteFormPopup]);

  const fetchApi = async () => {
    const getData = await getSubjects();
    setSubjectData(getData);
  };

  const handleDeleteSubject = async (id) => {
    const response = await deleteSubject(id);
    // if (response?.status === 200) {
    //   enqueueSnackbar('Subject Successfully Deleted!', { variant: 'success' });
    // } else {
    //   enqueueSnackbar('Unable to delete Subject!', { variant: 'error' });
    // }
    setDeleteFormPopup(false);
    setCardsUpdates(!cardsUpdates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const response = await addSubjects(data);
    // if (response?.status === 201) {
    //   enqueueSnackbar('Subject Successfully Created!', { variant: 'success' });
    // } else {
    //   enqueueSnackbar('Subject Not Created!', { variant: 'error' });
    // }
    setCardsUpdates(!cardsUpdates);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const response = await updateSubject(editSubjectDetail._id, data);
    // if (response?.status === 200) {
    //   enqueueSnackbar('Subject Successfully Updated!', { variant: 'success' });
    // } else {
    //   enqueueSnackbar('Unable to update Subject', { variant: 'error' });
    // }
    setEditFormPopup(false);
    setCardsUpdates(!cardsUpdates);
  };

  const handlePageChange = (event, newPage) => {
    classPageChange(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    classRowPerPageChange(+event.target.value);
    classPageChange(0);
  };

  const generateLightColor = () => {
    const minBrightness = 200;
    const randomRed = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    const randomGreen = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    const randomBlue = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    return `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
  };

  const colors = ['#ffb8ac', '#ff93ea', '#7fd0fb', '#4befda', '#ff91ae', '#ffcba0', '#7eeb9a', '#ffd778', '#feb7ab'];

  const getRandomColor = () => {
    return colors?.length > 0 ? colors[Math.floor(Math.random() * colors?.length)] : generateLightColor();
  };

  const [anchorEls, setAnchorEls] = useState({});

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
      <Container maxWidth={'xl'}>
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
            Subject Section
          </Typography>
          <Box
            sx={{
              maxWidth: '100%',
              border: '1 solid black',
              margin: 1,
              borderRadius: 5,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                padding: '2%',
                height: '30%',
                margin: 2,
                marginLeft: 1,
                border: '1 solid black',
                borderRadius: 5,
                boxShadow: '1px 2px 4px #BEBEC2'
              }}
            >
              <Typography variant="h4" component="h1" paragraph>
                Create Subject
              </Typography>
              <FormGroup>
                <form onSubmit={handleSubmit}>
                  <TextField
                    id="outlined-basic"
                    label="Subject Name"
                    className="text-field"
                    size="medium"
                    variant="outlined"
                    sx={{ margin: 2, width: '90% !important' }}
                    name="subject"
                    required
                  />
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    size="medium"
                    className="text-field"
                    label="Description"
                    rows={4}
                    multiline={true}
                    sx={{ margin: 2, width: '90% !important' }}
                    variant="outlined"
                    name="description"
                    required
                  />
                  <Button variant="contained" size="large" sx={{ marginLeft: '28%' }} type="submit">
                    Add Subject
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
                margin: 2,
                boxShadow: '1px 2px 4px #BEBEC2'
              }}
            >
              <Typography variant="h4" component="h1" paragraph>
                Subjects
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
                  {subjectData?.slice(classPage * classRowPerPage, classPage * classRowPerPage + classRowPerPage)?.map((data) => (
                    <Box
                      className="card"
                      sx={{
                        width: '11rem',
                        height: '30%',
                        borderRadius: '20px',
                        backgroundColor: getRandomColor(),
                        position: 'relative',
                        padding: '0.8rem',
                        border: '2px solid #c3c6ce',
                        transition: '0.5s ease-out',
                        overflow: 'visible',
                        margin: '23px 10px 15px 15px',
                        '&:hover': {
                          borderColor: '#008bf8',
                          boxShadow: '0 4px 18px 0 rgba(0, 0, 0, 0.25)'
                        }
                      }}
                      key={data._id}
                    >
                      <Box
                        className="cardDetails"
                        sx={{
                          color: 'black',
                          height: '100%',
                          gap: '.1rem',
                          display: 'grid',
                          placeContent: 'center'
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {data.subject}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '12px', textAlign: 'center' }}>
                          {data.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <TablePagination
                  rowsPerPageOptions={[6, 10, 25]}
                  component="div"
                  count={subjectData?.length}
                  rowsPerPage={classRowPerPage}
                  page={classPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Subjects;
