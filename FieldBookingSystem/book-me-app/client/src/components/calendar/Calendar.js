import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Modal, Form, InputGroup, ListGroup } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { isMobile, isTablet } from "react-device-detect";

import "./Calendar.css";
import { addBooking, getBooking } from "../../services/bookings";

export const MyCalendar = () => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userName, setUserName] = useState(null);
  const [approve, setApprove] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [events, setEvents] = useState([]);
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment());

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function isAnOverlapEvent(eventStartDay, eventEndDay) {
    for (let i = 0; i < events.length; i++) {
      const eventA = events[i];

      // start-time in between any of the events
      if (eventStartDay > eventA.start && eventStartDay < eventA.end) {
        console.log("start-time in between any of the events");
        return true;
      }
      //end-time in between any of the events
      if (eventEndDay > eventA.start && eventEndDay < eventA.end) {
        console.log("end-time in between any of the events");
        return true;
      }
      //any of the events in between/on the start-time and end-time
      if (eventStartDay <= eventA.start && eventEndDay >= eventA.end) {
        console.log(
          "any of the events in between/on the start-time and end-time"
        );
        return true;
      }
    }
    return false;
  }

  const handleRangeClick = (arg) => {
    const status = isAnOverlapEvent(arg.startStr, arg.endStr);
    if (status) {
      setShowAlert(true);
    } else {
      setDate(moment(arg.startStr).format("DD-MM-YYYY"));
      setStartTime(moment(arg.startStr).format("HH:mm"));
      setEndTime(moment(arg.endStr).format("HH:mm"));
      setEventData(arg);
      handleShow();
    }
  };

  const filterEventsForCurrentWeek = (events) => {
    const startOfWeek = currentWeek.clone().startOf('week');
    const endOfWeek = currentWeek.clone().endOf('week');
    return events.filter(event => 
      moment(event.start).isBetween(startOfWeek, endOfWeek, null, '[]')
    );
  };
  
  const groups = events.reduce((groups, game) => {
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

  const groupArraysForCurrentWeek = Object.keys(groups).map((date) => {
    const weekEvents = filterEventsForCurrentWeek(groups[date]);
    return {
      date,
      events: weekEvents,
    };
  }).filter(group => group.events.length > 0);  

  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      const message = `Hai saya ingin memesan lapangan
      Atas Nama: ${userName}
      Pada Tanggal: ${date}
      Jam : ${startTime} - ${endTime}`;

      getData();
      handleClose();
      let number = process.env.REACT_APP_TEST_PHONE_NUMBER.replace(
        /[^\w\s]/gi,
        ""
      ).replace(/ /g, "");
      let url = `${process.env.REACT_APP_WHATSAPP_URL}/${number}`;
      url += `/?text=${encodeURI(message)}`;
      window.open(url);
      setValidated(false);
      addBooking(eventData.startStr, eventData.endStr, userName);
    }
  }

  return (
    <div className="calendar-container py-3">
      <Container className={(isMobile || isTablet) && "w-100 p-0"}>
        <h5 className="text-white mb-5 text-center">
          <span style={{ fontWeight: 'bold', textDecoration: 'underline' , color: 'red'}}>Tahan dan Block</span> jam yang diinginkan untuk booking
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
          selectable={true}
          slotMinTime={"06:00:00"}
          slotMaxTime={"24:00:00"}
          locale={"id-ID"}
          timeZone={"local"}
          select={handleRangeClick}
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
          selectLongPressDelay={500}
          datesSet={(arg) => {
            if (showTimeTable) {
              const newCurrentWeek = moment(arg.start);
              if (!newCurrentWeek.isSame(currentWeek, 'week')) {
                setCurrentWeek(newCurrentWeek);
              }
            }
          }}
        />
        {showTimeTable && (
          <div className="back-white p-4 rounded">
            {groupArraysForCurrentWeek.length ? (
              groupArraysForCurrentWeek.map((group, index) => (
                <ListGroup key={index}>
                  <ListGroup.Item className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{moment(group.date).format("dddd")}</strong>
                      <strong>{moment(group.date).format("D MMM YYYY")}</strong>
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
                            className="fa-solid fa-circle"
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
              <h6 className="text-center">Tidak ada data ditemukan</h6>
            )}
          </div>
        )}
        <Modal
          show={show}
          onHide={handleClose}
          centered
          dialogClassName={`${isMobile || isTablet ? "mw-100" : "mw-75"}`}
          fullscreen={isMobile || isTablet}
        >
          <Modal.Header closeButton>
            <Modal.Title>Pesan Lapangan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={onSubmit}>
              <div className={isMobile || isTablet ? "row-col" : "row-justify"}>
                <div
                  className={isMobile || isTablet ? "width-100" : "width-45"}
                >
                  <h5>Waktu Booking</h5>
                  <Form.Label htmlFor="basic-url">
                    Tanggal Booking
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      defaultValue={date}
                      readOnly
                    />
                    <InputGroup.Text id="basic-addon3">
                      <i className="fa fa-calendar" aria-hidden="true"></i>
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Label htmlFor="basic-url">
                    Jam Booking
                  </Form.Label>
                  <div className="row-justify">
                    <InputGroup className="mb-3 w-75">
                      <Form.Control
                        id="basic-url"
                        aria-describedby="basic-addon3"
                        defaultValue={startTime}
                        readOnly
                      />
                      <InputGroup.Text id="basic-addon3">
                        <i className="fa-regular fa-clock"></i>
                      </InputGroup.Text>
                    </InputGroup>
                    <p className="w-25 text-center">-</p>
                    <InputGroup className="mb-3 w-75">
                      <Form.Control
                        id="basic-url"
                        aria-describedby="basic-addon3"
                        defaultValue={endTime}
                        readOnly
                      />
                      <InputGroup.Text id="basic-addon3">
                        <i className="fa-regular fa-clock"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
                <div
                  className={isMobile || isTablet ? "width-100" : "width-45"}
                >
                  <h5>Informasi</h5>
                  {/* <Form.Group controlId="validationCustom01">
                    <Form.Label htmlFor="basic-url" className="mt-4">
                      Nama Pemesan
                    </Form.Label>
                    <Form.Control
                      required
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Masukan Nama Pemesan"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Silahkan masukan nama anda
                    </Form.Control.Feedback>
                  </Form.Group> */}

                  <Form.Group>
                    <Form.Label htmlFor="basic-url" className="mt-4">
                      Nama Pemesan
                    </Form.Label>
                    <Form.Control
                      required
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Masukan Nama Pemesan"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Silahkan masukan nama anda
                    </Form.Control.Feedback>
                  </Form.Group>


                  <br/>
                  <h6>Menerima transaksi hanya melalui transfer ke rekening</h6>
                  <h6>BCA a.n. Susanto Suhadi 409-0656-703</h6>
                  <h6>atau pembayaran tunai.</h6>
                </div>
              </div>
              <div className={isMobile || isTablet ? "width-100" : "w-50"}>
                <Form.Check // prettier-ignore
                  className="font-small text-secondary mt-5"
                  type={"checkbox"}
                  label={
                    "Saya menyetujui pesanan sesuai dengan jadwal yang dipilih. Pesanan akan disetujui setelah mengirim pesan melalui WhatsApp dan menyertakan bukti pembayaran yang telah dilakukan. Pesanan akan dibatalkan jika tidak disertai bukti pembayaran dalam kurun waktu yang telah ditentukan."
                  }
                  onChange={(e) => setApprove(e.target.checked)}
                />
              </div>
              <hr />
              <Button variant="success" disabled={!approve} type={"submit"}>
                <i className="fa-brands fa-whatsapp"></i>&nbsp; Pesan
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {selectedEvent && (
          <Modal
            show={openEvent}
            onHide={() => setOpenEvent(false)}
            dialogClassName={`h-75 ${isMobile || isTablet ? "w-100" : "w-50"}`}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Informasi Booking</Modal.Title>
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
                  <strong>Tanggal Booking</strong>
                  <p className="text-secondary">
                    {moment(selectedEvent.start).locale("id-ID").format("dddd, D MMMM YYYY")}
                  </p>
                </div>
                <div>
                  <strong>Jam Booking</strong>
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
                  <strong>Nama Pemesan</strong>
                  <p className="text-secondary">{selectedEvent?.title}</p>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
        <Modal show={showAlert} onHide={() => setShowAlert(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Peringatan!!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Slot ini sudah dipesan. Silakan pesan pada slot yang kosong.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAlert(false)}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};
