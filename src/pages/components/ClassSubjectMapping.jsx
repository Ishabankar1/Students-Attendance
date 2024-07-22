// import React from 'react';

// const ClassSubjectMapping = () => {
//   return <div>ClassSubjectMapping</div>;
// };

// export default ClassSubjectMapping;

import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import Select from '@mui/material/Select';

import React, { useEffect, useState } from 'react';

import { getSubjects } from 'src/services/subjects/subjects.service';
import { getClasses } from 'src/services/classes/class.service';

import {
  createClassSubjectMapping,
  getClassSubjectMapping,
  deleteClassSubjectMapping
} from 'src/services/classSubjectMapping/classSubjectMapping.service';
import Autocomplete from '@mui/material/Autocomplete';

const ClassSubjectMapping = () => {
  const [classes, setClasses] = useState([0]);
  const [subjects, setSubjects] = useState([]);
  const [classSubMap, setClassSubMap] = useState([]);
  const [subjectId, setSubjectId] = useState(['']);
  const [classId, setClassId] = useState('');
  const [deleteFormPopup, setDeleteFormPopup] = useState(false);
  const [assignForm, setAssignForm] = useState(false);
  const [deleteClassesID, setDeleteClassesID] = useState();
  const [cardsUpdates, setCardsUpdates] = useState(true);

  useEffect(() => {
    fetchApi();
  }, [cardsUpdates]);

  const fetchApi = async () => {
    const Subjects = await getSubjects();
    const Classes = await getClasses();
    const classSubMap = await getClassSubjectMapping();
    setClassSubMap(classSubMap);
    setClasses(Classes);
    setSubjects(Subjects);
  };

  const handleChange = (event) => {
    setClassId(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let subjectArray = [];
    subjectId.map((item) => {
      let id = { id: item?._id };
      subjectArray.push(id);
    });

    if (classId === '' || subjectArray.length === 0) {
      // enqueueSnackbar('Please select class or Subjects!', { variant: 'warning' });
      return;
    }

    const payload = {
      classId: classId,
      subjectIds: subjectArray
    };

    const response = await createClassSubjectMapping(payload);
    // response?.status === 201
    //   ? enqueueSnackbar('Class Subject Successfully Assigned!', { variant: 'success' })
    //   : enqueueSnackbar('Unable to assign class subject!', { variant: 'error' });
    setCardsUpdates(!cardsUpdates);
  };

  const handleDeleteClasses = async (id) => {
    const payload = id;
    const response = await deleteClassSubjectMapping(payload);
    // response?.status === 200
    //   ? enqueueSnackbar('Class Subject Successfully Deleted!', { variant: 'success' })
    //   : enqueueSnackbar('Unable to delete class subject!', { variant: 'error' });
    setCardsUpdates(!cardsUpdates);
    setDeleteFormPopup(false);
  };

  function generateLightColor() {
    const minBrightness = 200;
    const randomRed = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    const randomGreen = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    const randomBlue = Math.floor(Math.random() * (255 - minBrightness) + minBrightness);
    return `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
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

  return subjects?.length === 0 ? (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  ) : (
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3" component="h1" paragraph>
            Class Subject Mapping
          </Typography>
          <Button variant="contained" sx={{ width: '100px', height: '30px', marginTop: 2 }} onClick={() => setAssignForm(!assignForm)}>
            Assign
          </Button>
        </Box>
        {assignForm && (
          <Box>
            <form onSubmit={onSubmit}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={4}>
                    <FormGroup>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Class Name</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={classId}
                          label="Class Name"
                          name="classId"
                          onChange={handleChange}
                          required
                        >
                          {classes.map((classes) => (
                            <MenuItem key={classes._id} value={classes._id}>
                              {classes.classname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <Autocomplete
                      multiple
                      id="subjects"
                      options={subjects}
                      disableCloseOnSelect
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => option?.subject}
                      onChange={(event, value) => setSubjectId(value)}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Subjects" />}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ marginLeft: 10, width: '100px', height: '30px', marginTop: 1 }}
                      type="submit"
                    >
                      Map
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        )}
        {classSubMap?.length === 0 ? (
          <Box sx={{ width: '44%', height: '56%', ml: '20%' }}>
          
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              marginTop: '20px',
              height: '80vh',
              mt: 2,
              border: '1px solid #ccc',
              boxShadow: '1px 2px 5px #ccc',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <Table stickyHeader>
              <TableHead sx={{ opacity: 1 }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Class</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Subjects
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classSubMap?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderBottom: '1px solid #ccc'
                      }}
                    >
                      {row?.className}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        borderBottom: '1px solid #ccc'
                      }}
                    >
                      {row?.subjects?.map((subject, i) => (
                        <Card
                          key={i}
                          color="primary"
                          sx={{
                            margin: '5px',
                            fontSize: '0.9rem',
                            height: '35px',
                            padding: 2,
                            paddingBottom: '35px',
                            backgroundColor: getRandomColor(),
                            fontWeight: '600'
                          }}
                        >
                          {subject?.subjectName}
                        </Card>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default ClassSubjectMapping;
