import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Label, Card, Button, Grid } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
          this.loadData(() => {
             //this.setState({ loaderData })
          })
          this.setState ({
              loaderData
          })
          loaderData.isLoading = false;


        console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here

        $.ajax({
            method: "GET",
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json; charset=utf-8'
            },
            dataType: 'json',
            success: function (res) {
                if (res.success == true && res.totalCount > 0) {
                    this.setState({
                        loadJobs : res.myJobs
                    })
                }
                else {
                    <Text>No Jobs Found</Text>
                }
            }.bind(this),
            error: function () {
                TalentUtil.notification.show("Error while retrieving data", "error");
            }
        })

    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        var { loadJobs } = this.state;
        if (loadJobs.length > 0) {
            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className ="ui container">
                    <h2>List of Jobs</h2>
                    <div className ="sort-filter">
                            <span>
                                <Icon name='filter'/>
                                    Filter:  
                                <Dropdown inline text=' Choose Filter' />
                            </span>
                            <span>
                                <Icon name='calendar alternate outline' />
                                    Sort by date:  
                                <Dropdown inline text=' Newest first' />
                            </span>
                    </div>
                    <div>
                    <Card.Group>
                        {loadJobs.map(j => {
                            let status;
                            if(j.status == 1) {
                                status = 'Active'
                            }
                            else {
                                status = 'Expired'
                            }
                            return (
                                <Card key={j.id}>
                                    <Card.Content>
                                        <Card.Header>{j.title}</Card.Header>
                                    <Label as='a' color='black' ribbon='right'>
                                        <Icon name='user' color='white' /> 0
                                    </Label>
                                        <Card.Meta>{j.location.city}, {j.location.country}</Card.Meta>
                                        <Card.Description className='job-description-summary'>{j.summary}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Button.Group floated='left'>
                                            <Button color='red'>
                                                {status}
                                            </Button>
                                        </Button.Group>
                                        <Button.Group icon floated='right'>
                                            <Button basic color='blue'>
                                            <Icon name='ban' />Close
                                            </Button>
                                            <Button basic color='blue'>
                                            <Icon name='edit outline' />Edit
                                            </Button>
                                            <Button basic color='blue'>
                                            <Icon name='copy outline' />Copy
                                            </Button>
                                        </Button.Group>
                                    </Card.Content>
                                </Card>
                            )
                        })}
                    </Card.Group>
                    
                    <Grid columns={1}>
                            <Grid.Column>
                            <Pagination
                                defaultActivePage={3}
                                totalPages={5}
                            />
                            </Grid.Column>
                        </Grid>
                    </div>
                    </div>
                </BodyWrapper>
            )
        }   
        else {
            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className ="ui container">
                    <h2>List of Jobs</h2>
                    <div className ="sort-filter">
                            <span>
                                <Icon name='filter'/>
                                    Filter:  
                                <Dropdown inline text=' Choose Filter' />
                            </span>
                            <span>
                                <Icon name='calendar alternate outline' />
                                    Sort by date:  
                                <Dropdown inline text=' Newest first' />
                            </span>
                    </div>
                    <span>No Jobs Found</span>
                    <Grid columns={1}>
                            <Grid.Column>
                            <Pagination
                                defaultActivePage={3}
                                totalPages={5}
                            />
                            </Grid.Column>
                        </Grid>
                    </div>
                </BodyWrapper>
            )
        }
    }
}