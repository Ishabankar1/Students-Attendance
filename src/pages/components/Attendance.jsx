// import React from 'react';

// const Attendance = () => {
//   return <div>Attendance</div>;
// };

// export default Attendance;
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
// import { DialogAnimate } from 'src/components/animate';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Grid,
  Stack,
  InputLabel,
  MenuItem,
  CircularProgress,
  IconButton,
  Select,
  Typography,
  TextField
} from '@mui/material';

import { getStudents } from 'src/services/students/students.service';
import {
  getStudentsByClassIdAndSubjectIdByAttendenceDate,
  noteAttendence,
  updateStudentAttendece
} from 'src/services/Attendence/attendence.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addClass, getClasses } from 'src/services/classes/class.service';
import { getSubjects, addSubjects, deleteSubject, updateSubject } from 'src/services/subjects/subjects.service';
import { getClassSubjectMapping } from 'src/services/classSubjectMapping/classSubjectMapping.service';

const Attendence = () => {
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [convertedDate, setConvertedDate] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [timetableClassNames, setTimetableClassNames] = useState([]);
  const [dayWiseSubjects, setDayWiseSubjects] = useState([]);
  const [clickedStudent, setClickedStudent] = useState(null);

  const [classSubjectMap, setClassSubjectMap] = useState([]);
  const fetchApi = async () => {
    const students = await getStudents();
    const getData = await getClasses();
    const classSubMap = await getClassSubjectMapping();
    setClassSubjectMap(classSubMap);
    setStudentsList(students);
    setTimetableClassNames(getData);
  };

  useEffect(() => {
    fetchApi();
  }, [classId, subjectId]);

  const fetchStudents = async () => {
    const AttendStudents = await getStudentsByClassIdAndSubjectIdByAttendenceDate(classId, subjectId, convertedDate);
    console.log('AttendStudents', AttendStudents);
    setFilteredStudents(AttendStudents);
  };

  function filterSubjectsByClassId(targetClassId) {
    console.log('targetClassId', targetClassId);
    const filteredSubjects = classSubjectMap.filter((subject) => subject.classId === targetClassId).map((subject) => subject.subjects);
    // console.log('filteredSubjects', filteredSubjects[0]);
    setDayWiseSubjects(filteredSubjects[0]);
  }

  const handleChange = async (event) => {
    setClassId(event.target.value);
    filterSubjectsByClassId(event.target.value);
  };

  const handleSubjectChange = async (event) => {
    setSubjectId(event.target.value);
  };

  const filterStudentsByClassId = (studentsList, classID) => {
    return studentsList.filter((item) => item.classId._id === classID)?.map((item) => item._id);
  };

  const addAttendence = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const filterData = filterStudentsByClassId(studentsList, classId);
    const payload = [];
    const nextDay = selectedDate?.add(1, 'day');
    const nestDate1 = dayjs(nextDay).toISOString();
    filterData?.map((student) => {
      payload.push({
        classId: data.classId,
        subjectId: data.subjectId,
        attendenceDate: nestDate1,
        attendenceType: 'Present',
        reason: 'present',
        studentId: student
      });
    });
    console.log(payload);
    const response = await noteAttendence(payload);
    if (response?.status === 201) {
      // enqueueSnackbar('Attendence Noted!', { variant: 'success' });
      fetchStudents();
    } else if (response?.status === 200) {
      // enqueueSnackbar('Attendence Already Noted!', { variant: 'warning' });
      fetchStudents();
    } else {
      // enqueueSnackbar('Unable to note attendence!', { variant: 'error' });
    }
  };

  const handleUpdateAttendence = async (event) => {
    if (event.target instanceof HTMLButtonElement) {
      const textFieldValue = event.currentTarget.querySelector('input[type="text"]')?.value;
      const updatedPayload = {
        attendenceType: event.target.textContent,
        reason: textFieldValue
      };
      const response = await updateStudentAttendece(clickedStudent?._id, updatedPayload);
      if (response?.status === 200) {
        // enqueueSnackbar('Attendence Updated!', { variant: 'success' });
        fetchStudents();
        handleClose();
      } else {
        // enqueueSnackbar('Unable to update attendence!', { variant: 'error' });
      }
    } else {
      // enqueueSnackbar('Please Enter Reason!', { variant: 'error' });
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const nextDay = date.add(1, 'day');
    const nextDate = dayjs(nextDay).toISOString();
    setConvertedDate(nextDate);
    const day = dayjs(date).format('dddd');
    if (day === 'Saturday' || day === 'Sunday') {
      // enqueueSnackbar('Please select date from Monday to Friday', { variant: 'warning' });
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return timetableClassNames?.length === 0 ? (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
      "No data found..."
    </Box>
  ) : (
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
            Attendance
          </Typography>
          <Box
            sx={{
              maxWidth: '100%',
              height: '100%',
              border: '1 solid black',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ width: '100%', boxShadow: '1px 2px 3px #ccc', borderRadius: 3, padding: 2 }}>
              <form onSubmit={addAttendence}>
                <FormControl sx={{ width: '100%' }}>
                  <Grid container spacing={3} m={'0.2px'}>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Classname</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={classId}
                          label="Classname"
                          onChange={handleChange}
                          required
                          name="classId"
                        >
                          {timetableClassNames?.map((data) => (
                            <MenuItem key={data?._id} value={data?._id}>
                              {data?.classname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3.2} sx={{ pt: '25px !important' }}>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            sx={{ height: '1.9em !important' }}
                            label="Select Date"
                            name="attendenceDate"
                            value={selectedDate ?? dayjs()}
                            onChange={handleDateChange}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Subject Name</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={subjectId}
                          label="Subject Name"
                          onChange={handleSubjectChange}
                          required
                          name="subjectId"
                        >
                          {dayWiseSubjects?.map((data) => (
                            <MenuItem key={data?.subjectId} value={data?.subjectId}>
                              {data?.subjectName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button sx={{ float: 'right', marginRight: 6, marginBottom: 2 }} type="submit" variant="contained">
                        Mark Attendance
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>
              </form>
            </Box>
          </Box>
          <Grid container spacing={3} m={'0.2px'}>
            {filteredStudents?.length > 0
              ? filteredStudents?.map((student) => (
                  <Grid key={student?._id} item xs={3} sx={{ cursor: 'pointer' }}>
                    <Card sx={{ display: 'flex', padding: '20px', flexDirection: 'column', border: '1px solid #ccc' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '9 0px',
                          position: 'relative'
                        }}
                      >
                        <Avatar alt="avatar" src={student?.studentId?.avatar} />
                      </Box>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {student?.studentId?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student?.studentId?.email}
                        </Typography>

                        <CardActions sx={{ justifyContent: 'center' }}>
                          {student?.attendenceType === 'Present' ? (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                handleClickOpen();
                                setClickedStudent(student);
                              }}
                            >
                              Present
                            </Button>
                          ) : student?.attendenceType === 'Absent' ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => {
                                handleClickOpen();
                                setClickedStudent(student);
                              }}
                            >
                              Absent
                            </Button>
                          ) : student?.attendenceType === 'Nursing' ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              onClick={() => {
                                handleClickOpen();
                                setClickedStudent(student);
                              }}
                            >
                              Nursing
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              color="info"
                              onClick={() => {
                                handleClickOpen();
                                setClickedStudent(student);
                              }}
                            >
                              Emergency
                            </Button>
                          )}
                        </CardActions>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : ' '}
          </Grid>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">{'Update Attendance'}</DialogTitle>
          <Stack direction="column">
            <Stack
              display="flex"
              flexDirection="row-reverse"
              // sx={{ background: theme.palette.background.neutral }}
            ></Stack>
            <Stack>
              <Card sx={{ maxWidth: '100%', margin: 2 }} onClick={handleUpdateAttendence}>
                <CardContent>
                  <Avatar sx={{ width: 100, height: 100, margin: 'auto' }} alt="User Profile" src={clickedStudent?.studentId?.avatar} />
                  <Typography variant="h5" component="div" sx={{ mt: 2, textAlign: 'center' }}>
                    {clickedStudent?.studentId?.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    {clickedStudent?.studentId?.username}
                  </Typography>
                  <br />
                  <TextField fullWidth type="text" id="my-text" label="Reason" variant="outlined" name="reason" required />
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around'
                    }}
                  >
                    <Button size="small" variant="contained">
                      Present
                    </Button>
                    <Button size="small" variant="contained" color="error">
                      Absent
                    </Button>
                    <Button size="small" variant="contained" color="warning">
                      Nursing
                    </Button>
                    <Button size="small" variant="contained" color="info">
                      Emergency
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Stack>
          </Stack>
        </Dialog>
      </Container>
    </>
  );
};

export default Attendence;
