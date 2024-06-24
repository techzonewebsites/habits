import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, ArrowBackIos, ArrowForwardIos, Check } from "@mui/icons-material";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
} from "date-fns";

const habitColors = ["#FDF2D0", "#BFDFCE", "#CCDAF5", "#D8D2E7"];

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [checked, setChecked] = useState({});
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [habitOpen, setHabitOpen] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"]; // Days of the week in French

  const dates = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleCheck = (habit, date) => {
    setChecked({
      ...checked,
      [`${habit}-${date}`]: !checked[`${habit}-${date}`],
    });
  };

  const handleAddHabitOpen = () => {
    setHabitOpen(true);
  };

  const handleAddHabitClose = () => {
    setHabitOpen(false);
    setNewHabit("");
    setNewHabitGoal("");
  };

  const handleAddHabit = () => {
    if (newHabit.trim() && newHabitGoal > 0 && newHabitGoal <= dates.length) {
      setHabits([...habits, { name: newHabit.trim(), goal: newHabitGoal }]);
      setNewHabit("");
      setNewHabitGoal("");
      handleAddHabitClose();
    }
  };

  const handleNoteOpen = () => {
    setNoteOpen(true);
  };

  const handleNoteClose = () => {
    setNoteOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="max-w-[1800px] mx-16">
      <Typography variant="h4" className="!mt-5 !mb-10">
        Suivi des habitudes
      </Typography>

      <h5 className="flex justify-center items-center gap-1 text-gray-500 mb-6">
        <IconButton onClick={handlePrevMonth}>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        {format(currentDate, "MMMM yyyy")} {/* Month and year in French */}
        <IconButton onClick={handleNextMonth}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </h5>

      <TableContainer component={Paper} className="!shadow-none">
        <Table>
          <TableHead>
            <TableRow className="!py-3">
              <TableCell
                rowSpan={3}
                className="!p-1 !text-xs  !text-center !text-blue-400"
              >
                Habitudes
              </TableCell>
              {dates.map((date, index) => (
                <TableCell
                  key={index}
                  className="!border-r !border-l !border-gray-300 !p-1 !text-xs !text-center"
                  style={{
                    backgroundColor: isToday(date) ? "black" : "white",
                    color: isToday(date) ? "#fff" : "inherit",
                  }}
                >
                  {daysOfWeek[getDay(date)]}
                </TableCell>
              ))}
              <TableCell
                rowSpan={2}
                className="!text-xs !text-center !text-blue-400"
              >
                Objectif
              </TableCell>
              <TableCell
                rowSpan={2}
                className="!text-xs !text-blue-400 !text-center"
              >
                Réalisé
              </TableCell>
            </TableRow>
            <TableRow>
              {dates.map((date) => (
                <TableCell
                  key={date}
                  className="!border-r !border-l !border-gray-300 !p-1 !text-xs !text-center"
                  style={{
                    backgroundColor: isToday(date) ? "black" : "white",
                    color: isToday(date) ? "#fff" : "inherit",
                  }}
                >
                  {format(date, "d")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {habits.map((habit, index) => (
              <TableRow key={index}>
                <TableCell className="!border-r !border-l !border-gray-300 !p-1 !text-xs !py-2">
                  {habit.name}
                </TableCell>
                {dates.map((date) => (
                  <TableCell
                    key={date}
                    onClick={() => handleCheck(habit.name, date)}
                    className="!cursor-pointer !text-center !border-r !border-gray-300 !p-1 !text-xs"
                    style={{
                      backgroundColor: checked[`${habit.name}-${date}`]
                        ? habitColors[index % habitColors.length]
                        : "white",
                    }}
                  >
                    {checked[`${habit.name}-${date}`] ? (
                      <Check fontSize="small" />
                    ) : (
                      <div className="!w-5 !h-5" />
                    )}
                  </TableCell>
                ))}
                <TableCell className="!border-r !border-gray-300 !p-px !text-xs !text-center">
                  {habit.goal}
                </TableCell>
                <TableCell
                  className={`!border-r !border-gray-300 !p-px !text-xs !text-center ${
                    dates.filter((date) => checked[`${habit.name}-${date}`])
                      .length >= habit.goal
                      ? "!bg-[#0ADB94]"
                      : "!bg-[#FEFC47]"
                  }`}
                >
                  {
                    dates.filter((date) => checked[`${habit.name}-${date}`])
                      .length
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="my-4">
        <button
          onClick={handleAddHabitOpen}
          className="flex items-center text-base"
        >
          <Add fontSize="small" />
          Nouvelle habitude
        </button>
      </div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleNoteOpen}
        className="!mt-4 !text-xs !text-center"
      >
        Ajouter une note
      </Button>
      <Dialog open={noteOpen} onClose={handleNoteClose}>
        <DialogTitle className="!text-sm">Ajouter une note</DialogTitle>
        <DialogContent>
          <DialogContentText className="!text-xs !text-center">
            Écrivez votre note pour la journée sélectionnée.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Note"
            type="text"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="!text-xs !text-center"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleNoteClose}
            color="primary"
            className="!text-xs !text-center"
          >
            Annuler
          </Button>
          <Button
            onClick={handleNoteClose}
            color="primary"
            className="!text-xs !text-center"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={habitOpen} onClose={handleAddHabitClose}>
        <DialogTitle className="!text-sm">
          Ajouter une nouvelle habitude
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newHabit"
            label="Nouvelle habitude"
            type="text"
            fullWidth
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="!text-xs !text-center"
          />
          <TextField
            margin="dense"
            id="newHabitGoal"
            label="Objectif (1-30)"
            type="number"
            fullWidth
            value={newHabitGoal}
            onChange={(e) =>
              setNewHabitGoal(
                Math.min(dates.length, Math.max(0, e.target.value))
              )
            }
            className="!text-xs !text-center"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddHabitClose}
            color="primary"
            className="!text-xs !text-center"
          >
            Annuler
          </Button>
          <Button
            onClick={handleAddHabit}
            color="primary"
            className="!text-xs !text-center"
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HabitTracker;