import React, { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@mui/material';

import { getStudents, deleteStudent } from 'src/services/students/students.service';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [studentPage, studentPageChange] = useState(0);
  const [studentRowPerPage, studentRowPerPageChange] = useState(10);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    const getData = await getStudents();
    setStudents(getData);
  };

  const handlechangepage = (event, newpage) => {
    studentPageChange(newpage);
  };

  const handleRowsPerPage = (event) => {
    studentRowPerPageChange(+event.target.value);
    studentPageChange(0);
  };

  return (
    <>
      <Container maxWidth={'xl'}>
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="h3" component="h1" paragraph>
            Students List
          </Typography>
        </Box>
        {students?.length !== 0 ? (
          <Paper>
            <TableContainer component={Paper} sx={{ mt: 2, border: '1px solid #ccc', boxShadow: '1px 2px 5px #ccc' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Sr_No</TableCell>
                    <TableCell align="center">Avatar</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Username</TableCell>
                    <TableCell align="center">Class Name</TableCell>
                    <TableCell align="center">Contact No.</TableCell>
                    <TableCell align="center">Gender</TableCell>
                    <TableCell align="center">Age</TableCell>
                    <TableCell align="center">Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students
                    .slice(studentPage * studentRowPerPage, studentPage * studentRowPerPage + studentRowPerPage)
                    .map((student, index) => (
                      <TableRow key={student._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center" component="th" scope="row">
                          {1 + index}
                        </TableCell>
                        <TableCell align="center">
                          <Avatar alt="avatar" src={student.avatar} />
                        </TableCell>
                        <TableCell align="center">{student.name}</TableCell>
                        <TableCell align="center">{student.username}</TableCell>
                        <TableCell align="center">{student.classId.classname}</TableCell>
                        <TableCell align="center">{student.phoneno}</TableCell>
                        <TableCell align="center">{student.gender}</TableCell>
                        <TableCell align="center">{student.age}</TableCell>
                        <TableCell align="center">{student.address.state}</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 7, 10]}
              rowsPerPage={studentRowPerPage}
              page={studentPage}
              count={students?.length}
              component="div"
              onPageChange={handlechangepage}
              onRowsPerPageChange={handleRowsPerPage}
            />
          </Paper>
        ) : (
          ''
        )}
      </Container>
    </>
  );
}
