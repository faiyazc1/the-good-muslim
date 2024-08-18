'use client'
import { Box, Stack, TextField, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from "react";


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salam! I’m here to share the wisdom and compassion of Islam :) How can I assist you today?'
    }
  ])
  const [message, setMessage] = useState('');


  const sendMessage = async () => {
    // Add the new user message to the existing messages
    setMessages((prevMessages) => [
      ...prevMessages, // Preserve existing messages
      { role: 'user', content: message }, // Add the new user message
      { role: 'assistant', content: '' }, // Placeholder for the assistant's response
    ]);

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }])
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((prevMessages) => {
          let lastMessage = prevMessages[prevMessages.length - 1];
          let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
};




  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
<Typography 
  variant="h2" 
  component="h1" 
  align="center"
  gutterBottom
  sx={{
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: 700,
    color: '#00e5ff', /* Stylish teal color */
    marginBottom: '30px', /* Adjusted space below heading */
    textShadow: '1px 1px 10px rgba(0, 229, 255, 0.5)', /* Softer, glowing shadow effect */
    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, /* Responsive font size */
    lineHeight: 1.2, /* Tighten line-height for a compact look */
    position: 'relative',
    '&:after': {
      content: '""',
      display: 'block',
      width: '60px',
      height: '4px',
      backgroundColor: '#00e5ff', /* Matching underline color */
      margin: '20px auto 0',
      borderRadius: '2px',
    },
  }}
>
  The Good Muslim
</Typography>







      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack 
          direction="column"
          spacing={2} 
          flexGrow={1} 
          overflow="auto" 
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
              border="1px solid blue"
                bgcolor={
                  message.role === 'assistant' 
                    ? 'primary.main' 
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack 
        direction="row" spacing={2}>
          <TextField
            sx={{
              border: '2px solid transparent', // Transparent border initially
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00e5ff', // Cyan border color when not focused
                  boxShadow: '0px 0px 8px 2px rgba(0, 229, 255, 0.6)', // Cyan glow
                },
                '&:hover fieldset': {
                  borderColor: '#00b3cc', // Slightly darker cyan on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00e5ff', // Cyan border when focused
                  boxShadow: '0px 0px 12px 5px rgba(0, 229, 255, 0.6)', // Stronger glow when focused
                },
              },
            }}
            fullWidth
            label="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage} border="3px solid white">
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}















