import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, RefreshCw, ThumbsUp, ThumbsDown, Send } from 'lucide-react'

// Types
type Email = {
  id: number
  sender: string
  subject: string
  body: string
  timestamp: string
  aiResponse?: string
  status: 'Pending' | 'Sent'
}

type Metrics = {
  totalEmails: number
  responseRate: number
  averageResponseTime: number
}

// Simulated AI response generation
const generateAIResponse = async (email: Email, prompt: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return `AI Response to "${email.subject}": ${prompt} ${email.body.substring(0, 50)}...`
}

// Simulated email sending
const sendEmail = async (email: Email): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log(`Email sent to ${email.sender}`)
}

export default function EmailAISystem() {
  const [emails, setEmails] = useState<Email[]>([])
  const [metrics, setMetrics] = useState<Metrics>({ totalEmails: 0, responseRate: 0, averageResponseTime: 0 })
  const [aiPrompt, setAiPrompt] = useState("Generate a polite and helpful response for this email:")
  const [isRefining, setIsRefining] = useState(false)
  const [newEmail, setNewEmail] = useState({ sender: '', subject: '', body: '' })

  // Simulated email receiving and processing
  useEffect(() => {
    const processEmails = async () => {
      for (const email of emails) {
        if (email.status === 'Pending' && !email.aiResponse) {
          const response = await generateAIResponse(email, aiPrompt)
          setEmails(prevEmails => prevEmails.map(e => 
            e.id === email.id ? { ...e, aiResponse: response, status: 'Sent' } : e
          ))
          await sendEmail({ ...email, aiResponse: response })
        }
      }
    }

    processEmails()
  }, [emails, aiPrompt])

  // Update metrics
  useEffect(() => {
    const sentEmails = emails.filter(e => e.status === 'Sent')
    setMetrics({
      totalEmails: emails.length,
      responseRate: emails.length ? (sentEmails.length / emails.length) * 100 : 0,
      averageResponseTime: sentEmails.length ? 2.3 : 0 // Simulated average response time
    })
  }, [emails])

  const handleRefineAI = () => {
    setIsRefining(true)
    // Simulate API call to refine AI
    setTimeout(() => {
      setIsRefining(false)
    }, 2000)
  }

  const handleNewEmail = (e: React.FormEvent) => {
    e.preventDefault()
    const newEmailObj: Email = {
      id: emails.length + 1,
      ...newEmail,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    }
    setEmails(prevEmails => [...prevEmails, newEmailObj])
    setNewEmail({ sender: '', subject: '', body: '' })
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Email AI Management System</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Emails Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{metrics.totalEmails}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{metrics.responseRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{metrics.averageResponseTime.toFixed(1)} min</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simulate New Email</CardTitle>
          <CardDescription>Add a new email to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewEmail} className="space-y-4">
            <Input
              placeholder="Sender"
              value={newEmail.sender}
              onChange={(e) => setNewEmail({ ...newEmail, sender: e.target.value })}
              required
            />
            <Input
              placeholder="Subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
              required
            />
            <Textarea
              placeholder="Email body"
              value={newEmail.body}
              onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
              required
            />
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Emails</CardTitle>
          <CardDescription>Latest emails processed by the AI</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>AI Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.sender}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell className="max-w-md truncate">{email.aiResponse || 'Generating...'}</TableCell>
                  <TableCell>
                    <Badge variant={email.status === 'Sent' ? 'default' : 'secondary'}>
                      {email.status === 'Sent' ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm"><ThumbsUp className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><ThumbsDown className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refine AI Prompt</CardTitle>
          <CardDescription>Adjust the AI prompt to improve response quality</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows={3}
            className="mb-4"
          />
          <Button onClick={handleRefineAI} disabled={isRefining}>
            {isRefining ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refining...
              </>
            ) : (
              'Refine AI Prompt'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
