import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Grid, Column, Tabs, TabList, Tab, TabPanels, TabPanel, Tile, TextInput, Button, Tag, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody } from '@carbon/react';
import { UserAvatar, Microphone, Send } from '@carbon/icons-react';
import ProjectsTab from '@/Components/Landing/ProjectsTab';
import CalendarTab from '@/Components/Landing/CalendarTab';
import DeliverablesTab from '@/Components/Landing/DeliverablesTab';
import VoiceOrb from '@/Voice/VoiceOrb';
import type { Project, Meeting, Commitment, Communication, Reminder, SharedProps } from '@/types';
import type { ReactNode } from 'react';

interface LandingProps extends SharedProps {
    projects: Project[];
    meetings: Meeting[];
    actions: Commitment[];
    communications: Communication[];
    reminders: Reminder[];
}

export default function Landing({ currentUser, projects, meetings, actions, communications, reminders, voiceConfigured }: LandingProps) {
    const [voiceOpen, setVoiceOpen] = useState(false);
    const [queryText, setQueryText] = useState('');

    // Get upcoming meetings (next 3)
    const upcomingMeetings = meetings.slice(0, 3);
    
    // Get today's action items (next 5)
    const todayActions = actions.slice(0, 5);

    const handleSendQuery = () => {
        if (queryText.trim()) {
            // TODO: Implement text query handling
            console.log('Query:', queryText);
            setQueryText('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendQuery();
        }
    };

    return (
        <>
            <Head title="Welcome" />
            
            <div className="landing-page">
                <Grid className="landing-grid">
                    <Column lg={16} md={8} sm={4}>
                        <div className="user-profile-section">
                            <Tile className="user-profile-tile">
                                <div className="user-avatar-container">
                                    <UserAvatar size={120} />
                                </div>
                                <h1 className="user-greeting">Welcome, {currentUser.name}</h1>
                                <p className="user-subtitle">{currentUser.role}</p>
                            </Tile>
                        </div>
                    </Column>

                    {/* Interactive Query Section */}
                    <Column lg={16} md={8} sm={4}>
                        <div className="query-section">
                            <div className="query-input-wrapper">
                                <TextInput
                                    id="query-input"
                                    labelText=""
                                    placeholder="Ask Atlas anything... e.g., 'What's my priority today?' or 'Show me blockers'"
                                    value={queryText}
                                    onChange={(e) => setQueryText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    size="lg"
                                />
                                <div className="query-buttons">
                                    <Button
                                        kind="ghost"
                                        renderIcon={Microphone}
                                        iconDescription="Voice input"
                                        hasIconOnly
                                        onClick={() => setVoiceOpen(true)}
                                        size="lg"
                                    />
                                    <Button
                                        kind="primary"
                                        renderIcon={Send}
                                        iconDescription="Send"
                                        hasIconOnly
                                        onClick={handleSendQuery}
                                        disabled={!queryText.trim()}
                                        size="lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </Column>

                    <Column lg={16} md={8} sm={4}>
                        <Tabs>
                            <TabList aria-label="Main navigation tabs" contained>
                                <Tab>Projects</Tab>
                                <Tab>Calendar</Tab>
                                <Tab>Deliverables</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <ProjectsTab projects={projects} />
                                </TabPanel>
                                <TabPanel>
                                    <CalendarTab
                                        meetings={meetings}
                                        actions={actions}
                                        reminders={reminders}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <DeliverablesTab
                                        communications={communications}
                                        actions={actions}
                                        projects={projects}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Column>

                    {/* Meeting Agenda & Action Items Section */}
                    <Column lg={16} md={8} sm={4}>
                        <div className="snapshot-section">
                            <Grid>
                                <Column lg={8} md={4} sm={4}>
                                    <Tile className="snapshot-tile">
                                        <h3 className="snapshot-title">Upcoming Meetings</h3>
                                        {upcomingMeetings.length > 0 ? (
                                            <StructuredListWrapper>
                                                <StructuredListHead>
                                                    <StructuredListRow head>
                                                        <StructuredListCell head>Meeting</StructuredListCell>
                                                        <StructuredListCell head>Time</StructuredListCell>
                                                        <StructuredListCell head>Location</StructuredListCell>
                                                    </StructuredListRow>
                                                </StructuredListHead>
                                                <StructuredListBody>
                                                    {upcomingMeetings.map((meeting) => (
                                                        <StructuredListRow key={meeting.id}>
                                                            <StructuredListCell>
                                                                <strong>{meeting.title}</strong>
                                                                <br />
                                                                <span className="meeting-date">{meeting.date}</span>
                                                            </StructuredListCell>
                                                            <StructuredListCell>
                                                                {meeting.start_time} - {meeting.end_time}
                                                            </StructuredListCell>
                                                            <StructuredListCell>
                                                                {meeting.location || 'Virtual'}
                                                            </StructuredListCell>
                                                        </StructuredListRow>
                                                    ))}
                                                </StructuredListBody>
                                            </StructuredListWrapper>
                                        ) : (
                                            <p className="empty-state">No upcoming meetings</p>
                                        )}
                                    </Tile>
                                </Column>

                                <Column lg={8} md={4} sm={4}>
                                    <Tile className="snapshot-tile">
                                        <h3 className="snapshot-title">Priority Action Items</h3>
                                        {todayActions.length > 0 ? (
                                            <div className="action-items-list">
                                                {todayActions.map((action) => (
                                                    <div key={action.id} className="action-item">
                                                        <div className="action-header">
                                                            <span className="action-title">{action.description}</span>
                                                            <Tag
                                                                type={
                                                                    action.status === 'overdue' ? 'red' :
                                                                    action.status === 'in_progress' ? 'blue' :
                                                                    'gray'
                                                                }
                                                                size="sm"
                                                            >
                                                                {action.status}
                                                            </Tag>
                                                        </div>
                                                        <div className="action-meta">
                                                            <span className="action-project">{action.project?.name}</span>
                                                            {action.due_date && (
                                                                <span className="action-due">Due: {action.due_date}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="empty-state">No action items</p>
                                        )}
                                    </Tile>
                                </Column>
                            </Grid>
                        </div>
                    </Column>
                </Grid>
            </div>

            {/* Voice Assistant */}
            <VoiceOrb open={voiceOpen} onOpenChange={setVoiceOpen} voiceConfigured={voiceConfigured} />
        </>
    );
}

// Opt out of default AppLayout for landing page - use minimal layout
Landing.layout = (page: ReactNode) => page;

// Made with Bob
