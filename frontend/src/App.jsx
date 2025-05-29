import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Spinner,
  Badge,
  Form,
} from "react-bootstrap";
import ToastMessage from "./components/ToastMessage";
import api from "./api";
import { API, wsApi } from "./config";

const STARTER_TEMPLATES = [
  { key: "react-starter", label: "React (Vite)" },
  { key: "node-starter", label: "Node.js (Express)" },
  { key: "html-starter", label: "HTML/CSS/JS" },
];

function getLocalUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = "user-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("userId", userId);
  }
  return userId;
}

function getSavedContainerInfo(userId) {
  const data = localStorage.getItem("containerInfo-" + userId);
  if (data) return JSON.parse(data);
  return null;
}

function saveContainerInfo(userId, info) {
  localStorage.setItem("containerInfo-" + userId, JSON.stringify(info));
}

function clearContainerInfo(userId) {
  localStorage.removeItem("containerInfo-" + userId);
}

export default function App() {
  const [userId] = useState(getLocalUserId());
  const [containerInfo, setContainerInfo] = useState(() =>
    getSavedContainerInfo(userId)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(
    STARTER_TEMPLATES[0].key
  );
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [logs, setLogs] = useState("");
  const wsRef = useRef(null);

  useEffect(() => {
    setContainerInfo(getSavedContainerInfo(userId));
  }, [userId]);

  async function spinUp() {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/init", {
        userId,
        template: selectedTemplate,
      });
      if (res.status === 201) {
        const info = res.data;
        setContainerInfo(info);
        saveContainerInfo(userId, info);
        setSuccess("Environment ready!");
        setToast({
          show: true,
          message: "Environment ready!",
          variant: "success",
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Error";
      setError(msg);
      setToast({ show: true, message: msg, variant: "danger" });
    } finally {
      setLoading(false);
    }
  }

  function openViteApp() {
    if (containerInfo && containerInfo.vitePort) {
      window.open(`${API}:${containerInfo.vitePort}`, "_blank");
    }
  }

  function openVSCode() {
    if (containerInfo && containerInfo.codeServerPort) {
      window.open(`${API}:${containerInfo.codeServerPort}`, "_blank");
    }
  }

  async function handleRemove() {
    try {
      setLoading(true);
      const { containerId } = containerInfo;
      if (!containerId) {
        setToast({
          show: true,
          message: "container is not available, either may be deleted",
          variant: "danger",
        });
        return;
      }
      const res = await api.post(`/api/remove-container/`, {
        containerId,
        userId,
      });

      if (res.status == 200) {
        clearContainerInfo(userId);
        setContainerInfo(null);
        setSuccess("");
        setError("");
        setLogs("");
        setToast({
          show: true,
          message: "Container removed!",
          variant: "success",
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Error";
      setError(msg);
      setToast({ show: true, message: msg, variant: "danger" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setTimeout(() => {
      if (containerInfo && containerInfo?.codeServerPort) {
        openVSCode();
      }
    }, 1200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerInfo]);

  useEffect(() => {
    (() => {
      try {
        if (wsRef.current) wsRef.current.close();
        const ws = new WebSocket(`ws://${wsApi}/ws/logs?userId=${userId}`);
        wsRef.current = ws;
        ws.onmessage = (e) => setLogs((logs) => logs + e.data);
        ws.onclose = () => {
          setToast({ show: true, message: "logs closed", variant: "waning" });
        };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Error";
        setError(msg);
        setToast({ show: true, message: msg, variant: "danger" });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsRef, containerInfo]);

  return (
    <Container
      fluid
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark"
    >
      <Row className="w-100 justify-content-center mb-4">
        <Col xs={12} md={8} lg={6} xl={8}>
          <Card className="shadow-sm border-0 mt-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h4 className="fw-bold text-primary mb-0">
                    Dev Environment Dashboard
                  </h4>
                  <div className=" w-100 text-muted small d-flex item-center justify-content-between">
                    <div>
                      <Badge bg="info">User ID</Badge>{" "}
                      <span className="fw-bold">{userId}</span>
                    </div>
                  </div>
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2721/2721212.png"
                  alt="App Icon"
                  style={{ width: 48, height: 48, opacity: 0.7 }}
                />
              </div>
              <hr />
              <div className="mb-3">
                <Form>
                  <Form.Group>
                    <Form.Label>Select Starter Template</Form.Label>
                    <Form.Select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      disabled={loading}
                    >
                      {STARTER_TEMPLATES.map((t) => (
                        <option value={t.key} key={t.key}>
                          {t.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Form>
              </div>
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="primary"
                  onClick={spinUp}
                  disabled={loading}
                  className="px-4"
                >
                  {loading && (
                    <Spinner
                      as="span"
                      size="sm"
                      animation="border"
                      className="me-2"
                    />
                  )}
                  {containerInfo ? "Re-Spin App" : "Spin Up App"}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRemove}
                  disabled={loading || !containerInfo}
                  className="px-4"
                >
                  Remove container
                </Button>
              </div>
              {error && (
                <Alert variant="danger" className="py-1 my-2">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="py-1 my-2">
                  {success}
                </Alert>
              )}
              <hr className="my-3" />
              <div>
                {containerInfo ? (
                  <>
                    <Card className="mb-3 border-0 bg-light">
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center mb-2">
                          <Badge bg="primary" className="me-2">
                            VS Code
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={openVSCode}
                          >
                            Open Editor
                          </Button>
                          <span className="ms-3 text-muted small">
                            Port: <b>{containerInfo.codeServerPort}</b>
                          </span>
                        </div>
                        {containerInfo.vitePort && (
                          <div className="d-flex align-items-center">
                            <Badge bg="success" className="me-2">
                              Vite App
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={openViteApp}
                            >
                              Open App
                            </Button>
                            <span className="ms-3 text-muted small">
                              (First run{" "}
                              <code>npm run dev -- --host 0.0.0.0</code> in
                              terminal) &nbsp;|&nbsp; Port:{" "}
                              <b>{containerInfo.vitePort}</b>
                            </span>
                          </div>
                        )}
                        {containerInfo.nodePort && (
                          <div className="d-flex align-items-center mt-2">
                            <Badge bg="secondary" className="me-2">
                              Node.js App
                            </Badge>
                            <span className="text-muted small">
                              App port: <b>{containerInfo.nodePort}</b>
                              <Button
                                size="sm"
                                className="mx-3"
                                variant="secondary"
                                onClick={() => {
                                  if (containerInfo && containerInfo.nodePort) {
                                    window.open(
                                      `${API}:${containerInfo.nodePort}`,
                                      "_blank"
                                    );
                                  }
                                }}
                              >
                                Open browser
                              </Button>
                            </span>
                          </div>
                        )}
                        {containerInfo.htmlPort && (
                          <div className="d-flex align-items-center mt-2">
                            <Badge bg="warning" className="me-2">
                              Static App
                            </Badge>
                            <span className="text-muted small">
                              Static app port: <b>{containerInfo.htmlPort}</b>
                              <Button
                                size="sm"
                                className="mx-3"
                                variant="primary"
                                onClick={() => {
                                  if (containerInfo && containerInfo.htmlPort) {
                                    window.open(
                                      `${API}:${containerInfo.htmlPort}`,
                                      "_blank"
                                    );
                                  }
                                }}
                              >
                                Open browser
                              </Button>
                            </span>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                    <TableInfo
                      info={containerInfo}
                      logs={logs}
                      onClearLogs={() => setLogs("logs...")}
                    />
                  </>
                ) : (
                  <Alert variant="secondary" className="mt-3 mb-0">
                    No active environment. Click <b>Spin Up App</b> to begin!
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
          <div className="text-center text-muted small mt-3">
            <span>&copy; {new Date().getFullYear()} Remote Dev Platform</span>
          </div>
        </Col>
      </Row>
      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </Container>
  );
}

function TableInfo({ info, logs, onClearLogs }) {
  return (
    <Card className="shadow-sm border-0 mt-3">
      <Card.Body className="p-3">
        <button className="btn btn-sm border" onClick={() => onClearLogs()}>
          clear logs
        </button>
        <pre
          style={{
            marginTop: 16,
            minHeight: 160,
            background: "#212529",
            color: "#d1d1d1",
            padding: 16,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {logs || "Click 'Run App' to view logs..."}
        </pre>
        <div className="row mb-2">
          <div className="col-5 text-muted">Container Name:</div>
          <div className="col-7">
            <code>{info.containerName}</code>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-5 text-muted">Workspace Path:</div>
          <div className="col-7">
            <code>{info.workspacePath}</code>
          </div>
        </div>
        <div className="row">
          <div className="col-5 text-muted">Container ID:</div>
          <div className="col-7">
            <code>{info.containerId}</code>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
