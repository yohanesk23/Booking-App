import React, { useState, useEffect } from "react";
import { Container, Button, Modal, ListGroup } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { isMobile, isTablet } from "react-device-detect";

import {
  approveBooking,
  getBooking,
  rejectBooking,
} from "../services/bookings";
import "../style.css";

export const Admin = () => {
  const [events, setEvents] = useState([]);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getBooking().then((res) => {
      if (res.status === 200) {
        const newBookings = res.bookings.map((data) => {
          let newData = { ...data };
          if (data.bookingStatus === "pending") {
            newData.color = "yellow";
            newData.textColor = "black";
          } else if (data.bookingStatus === "approved") {
            newData.color = "green";
            newData.textColor = "white";
          }
          return newData;
        });
        setEvents(newBookings);
      }
    });
  };

  const handleApprove = (event) => {
    approveBooking(
      event._id ? event._id : event._def.extendedProps._id,
      "approved"
    ).then((res) => {
      if (res.status) {
        getData();
      }
    });
    setOpenEvent(false);
  };

  const handleReject = (event) => {
    rejectBooking(event._id ? event._id : event._def.extendedProps._id).then(
      (res) => {
        if (res.data.acknowledged) {
          getData();
        }
      }
    );
    setOpenEvent(false);
  };

  const groups =
    events &&
    events.reduce((groups, game) => {
      const date = game.start.split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      events: groups[date],
    };
  });

  return (
    <Container className="my-4">
      <div className="calendar-container py-3">
        <Container>
          <h5 className="text-white my-5 text-left" style={{ textAlign: 'left', alignSelf: 'flex-start' }}>
            Menyetujui Pesanan <br />
            1. Klik slot time yang berwarna <span style={{ fontWeight: 'bold', textDecoration: 'underline' , color: 'yellow'}}>kuning</span>  <br />
            2. Klik tombol "Approve" <br/>
            <br/>
            Menolak Pesanan <br />
            1. Klik slot time yang berwarna <span style={{ fontWeight: 'bold', textDecoration: 'underline' , color: 'yellow'}}>kuning</span> atau <span style={{ fontWeight: 'bold', textDecoration: 'underline' , color: 'green'}}>hijau</span> <br />
            2. Klik tombol "Reject" <br/>
          </h5>
          <FullCalendar
            customButtons={{
              myCustomButton: {
                text: "Booking",
                click: function () {
                  setShowTimeTable(false);
                },
              },
              myCustomButton1: {
                text: "Timetable",
                click: function () {
                  setShowTimeTable(true);
                },
              },
            }}
            views={{
              timeGridThreeDay: {
                type: "timeGrid",
                duration: { days: 3 },
              },
            }}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView={
              isMobile || isTablet ? "timeGridThreeDay" : "timeGridWeek"
            }
            headerToolbar={{
              left: "today prev,next",
              center: "title",
              right: "myCustomButton myCustomButton1",
            }}
            dayHeaderClassNames={"back-white"}
            viewClassNames={showTimeTable ? "display-none" : "back-white"}
            allDaySlot={false}
            slotMinTime={"06:00:00"}
            slotMaxTime={"24:00:00"}
            locale={"id-ID"}
            timeZone={"local"}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
            }}
            nowIndicator={true}
            contentHeight={showTimeTable ? 0 : "auto"}
            slotDuration={"01:00:00"}
            events={events}
            selectAllow={function (selectInfo) {
              return moment().diff(selectInfo.start) <= 0;
            }}
            eventClick={(arg) => {
              setOpenEvent(true);
              setSelectedEvent(arg.event);
            }}
          />
          {showTimeTable && (
            <div className="back-white p-4 rounded">
              {groupArrays.length ? (
                groupArrays.map((group, index) => (
                  <ListGroup key={index}>
                    <ListGroup.Item className="bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{moment(group.date).format("dddd")}</strong>
                        <strong>
                          {moment(group.date).format("D MMM YYYY")}
                        </strong>
                      </div>
                    </ListGroup.Item>
                    {group.events.map((event, index) => (
                      <ListGroup.Item
                        key={index}
                        onClick={() => {
                          setOpenEvent(true);
                          setSelectedEvent(event);
                        }}
                        className="list-item"
                      >
                        <div className="d-flex gap-5 text-secondary align-items-center my-3">
                          {moment(event.start).format("HH:mm")} -{" "}
                          {moment(event.end).format("HH:mm")}
                          <div className="d-flex gap-2 align-items-center">
                            <i
                              class="fa-solid fa-circle"
                              style={{
                                color:
                                  event.bookingStatus === "pending"
                                    ? "yellow"
                                    : event.bookingStatus === "approved"
                                    ? "green"
                                    : "#2c38dd",
                              }}
                            ></i>
                            <span className="text-black">{event.title}</span>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ))
              ) : (
                <h6 className="text-center">No data found</h6>
              )}
            </div>
          )}
          {selectedEvent && (
            <Modal
              show={openEvent}
              onHide={() => setOpenEvent(false)}
              dialogClassName={`h-75 ${
                isMobile || isTablet ? "w-100" : "w-50"
              }`}
            >
              <Modal.Header closeButton>
                <Modal.Title>Detail Booking</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div
                  className={
                    isMobile || isTablet
                      ? "d-flex flex-column"
                      : "d-flex align-items-center gap-5"
                  }
                >
                  <div>
                    <strong>Booking Date</strong>
                    <p className="text-secondary">
                      {moment(selectedEvent.start).format("dddd, MMMM D, YYYY")}
                    </p>
                  </div>
                  <div>
                    <strong>Time Period</strong>
                    <p className="text-secondary">
                      {moment(selectedEvent.start).format("HH:mm")} -{" "}
                      {moment(selectedEvent.end).format("HH:mm")}
                    </p>
                  </div>
                </div>
                <hr />
                <div
                  className={
                    isMobile || isTablet
                      ? "d-flex flex-column"
                      : "d-flex align-items-center gap-5"
                  }
                >
                  <div>
                    <strong>User Name</strong>
                    <p className="text-secondary">{selectedEvent.title}</p>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="danger"
                  onClick={() => handleReject(selectedEvent)}
                >
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedEvent)}>
                  Approve
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Container>
      </div>
    </Container>
  );
};
