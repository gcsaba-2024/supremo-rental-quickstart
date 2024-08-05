import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, FormControl, FormGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeAngle } from '@fortawesome/free-solid-svg-icons'; // Add this import

function AskMe({ onLogout, userJsonVal, bookingCount }) {
    const [userDataN, setUserData] = useState([userJsonVal]);
    const [backendData, setBackendData] = useState([]);
    const [carsCountData, setcarsCountData] = useState([]);
    const nav = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showIdeaModal, setShowIdeaModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('userid'));
    const getUserId = localStorage.getItem('userid');

    useEffect(() => {
        if (getUserId) {
            console.log('Fetching data for user ID:', getUserId);
            fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/order-service/user-orders?userid=${getUserId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Data from server:)) ", data);
                    setBackendData(data);
                    setcarsCountData(data);
                })
                .catch((err) => {
                    console.log('Error fetching data:', err);
                });
        }
    }, [getUserId]);

    const handleLogout = () => {
        localStorage.removeItem('userid');
        setToken(null);
        nav('/');
    };

    const [searchValue, setSearchValue] = useState('');
    const onChange = (event) => {
        setSearchValue(event.target.value);
    }

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpenSearch = () => {
        setLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic b3NtYXN0ZXI6T3NtYXN0ZXJAMTIz");

        const raw = JSON.stringify({
            "query": {
                "match": {
                "text": searchValue
                }
            }
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://132.145.171.77:5000/askme-search`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setSearchResults(result);
            })
            .catch(error => {
                console.log('Error fetching search results:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [searchSemanResults, setSearchSemanResults] = useState([]);
    const [loadingSeman, setLoadingSeman] = useState(false);

    const handleOpenSemanticSearch = () => {
        setLoadingSeman(true);

        const myHeadersSemantic = new Headers();
        myHeadersSemantic.append("Content-Type", "application/json");
        myHeadersSemantic.append("Authorization", "Basic b3NtYXN0ZXI6T3NtYXN0ZXJAMTIz");

        const rawSemantic = JSON.stringify({
            "query": {
                "bool" : {
                "should" : [
                    {
                    "script_score": {
                        "query": {
                        "neural": {
                            "passage_embedding": {
                            "query_text": searchValue,
                            "model_id": "N0vl8JABAfnkX8nqWIjf",
                            "k": 5
                            }
                        }
                        },
                        "script": {
                        "source": "_score * 1.5"
                        }
                    }
                    }
                ]
                }
                },
                "fields": [
                "question", "text","url"
                ],
                "_source": false
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeadersSemantic,
            body: rawSemantic,
            redirect: 'follow'
        };

        fetch(`http://132.145.171.77:5000/askme-semanticsearch`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(result => {
                console.log("setSearchSemanResults ", result);
                setSearchSemanResults(result);
            })
            .catch(error => {
                console.log('Error fetching search results:', error);
            })
            .finally(() => {
                setLoadingSeman(false);
            });
    };

    const handleSearch = () => {
        handleOpenSearch();
        handleOpenSemanticSearch();
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenIdeaModal = () => { setShowIdeaModal(true); };
    const handleCloseIdeaModal = () => { setShowIdeaModal(false); };

    return (
        <>
            <div>
                <TopNavBarN onLogout={handleLogout} userJsonVal={userDataN} bookingCount={carsCountData.length} />
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-md-12">
                            <div className="backBtn-wrap rounded-right w-100 text-left">
                                <div className="col-md-12 d-flex align-items-center bg-primary">
                                    <form className="askme-request-form bg-primary fadeInUp text-left d-flex w-100">
                                        <div className="d-flex align-bottom w-100">
                                            <div className="form-group mr-2 d-flex col-md-12 searchTxtOuter">
                                                <div className="col-md-2">
                                                    <span className="askMeTxt"><FontAwesomeIcon icon={faHandshakeAngle} /> Ask Me</span>
                                                </div>
                                                <FormGroup className="col-md-7">
                                                    <FormControl type="text" placeholder="Search - Opensearch" className="searchTxt" value={searchValue} onChange={onChange} />
                                                </FormGroup>{' '}
                                                <Button className="col-md-2 btn btn-secondary" onClick={handleSearch}>Submit</Button>
                                                <div className='col-md-1'></div>
                                            </div>
                                        </div>
                                    </form>
                                    <button className="btn py-2 mr-2 foridea_bulb_Btn" onClick={handleOpenIdeaModal}><img src='/resources/images/idea-bulb.svg'/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="ftco-section-askme bg-light">
                    <div className="container">
                        <div className="container no-gutters">
                            <div className="row no-gutters">
                                <div className="col-md-12 featured-top">
                                    <div className="row no-gutters">
                                        <div className="col-md-12 d-flex align-items-top carBigImage mt-4 ml-0">
                                            <div className="services-wrap1 rounded-right w-100 text-left col-md-6" style={{ marginLeft: "-15px", paddingRight: "0px" }}>
                                                <Container  style={{ marginLeft: "-15px", paddingRight: "0px" }}>
                                                    <Row className='rowHeadingHt'>
                                                        <Col><h5>Keyword</h5></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            {loading && <p>Loading...</p>}
                                                            {searchResults.hits?.hits.map((result, index) => (
                                                                <div key={index} className="result-card">
                                                                    <h5>{result._source.question || result._source.Question}</h5>
                                                                    <p>{result._source.text || result._source.text}</p>
                                                                    <a href={result._source.url} target="_blank" rel="noopener noreferrer">
                                                                        {result._source.url}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </div>
                                            <div className="services-wrap1 rounded-right w-100 text-left col-md-6 ml-4" style={{ marginLeft: "-15px", paddingRight: "0px" }}>
                                                <Container style={{ marginLeft: "-15px", paddingRight: "0px" }}>
                                                    <Row className='rowHeadingHt'>
                                                        <Col><h5>Semantic</h5></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            {loadingSeman && <p>Loading...</p>}
                                                            {/* Display semantic search results */}
                                                            {searchSemanResults.hits?.hits.map((result, index) => (
                                                                <div key={index} className="result-card">
                                                                    <h5>{result.fields.question[0]}</h5>
                                                                    <p>{result.fields.text[0]}</p>
                                                                    <a href={result.fields.url[0]} target="_blank" rel="noopener noreferrer">
                                                                        {result.fields.url[0]}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <FooterSection />
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title> - Car Health</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col className='col-sm-12'>
                                <p><strong>Type</strong>:&nbsp;Search Engine</p>
                                <p><strong>Why?</strong>:&nbsp;</p>
                                <ul>
                                    <li>Insight engine to perform real-time search on text, documents like FAQs, billing queries, car manual</li>
                                    <li>Ability to ingest, visualize, and analyze log data</li>
                                </ul>
                                <p><strong>OCI Differentiator</strong>:&nbsp;Choose the exact number of cores/memory as per workload, automated high availability</p>
                                <p><strong>Outcome</strong>:&nbsp;Real-time text search, analysis of log data</p>
                                <p><em><strong>Find out more</strong></em>:&nbsp;<a href="https://www.oracle.com/cloud/search/">Link</a></p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showIdeaModal} onHide={handleCloseIdeaModal} className='askMeImgModal' centered>
                <Modal.Header closeButton>
                    <Modal.Title> Real Time Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col className='col-12'>
                                <p><img src='/resources/images/popup-img/OpenSearch_1.svg'/></p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseIdeaModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AskMe;
