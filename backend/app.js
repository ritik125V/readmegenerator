import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import verify from './verify.js'
import dotenv from 'dotenv'

dotenv.config()

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const jwtSecret = process.env.JWT_SECRET
const origin = process.env.ORIGIN
const app = express()


app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173" ||process.env.ORIGIN,
        credentials: true,
        methods: ["GET" , "POST" , "PUT" , "DELETE"],
    }
));

// redirect krne ka route
app.get('/auth/github' , (req , res)=>{
  const redirectUrl = process.env.ORIGIN+'/auth/github/callback' ||'http://localhost:3000/auth/github/callback' 
  
  const Uri = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=user:email`

  res.redirect(Uri)
});


// http://localhost:3000/auth/github/callback?code=xyz
// **redirectone**
app.get('/auth/github/callback',async(req , res )=>{
    const code = req.query.code;
    

    const TokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: clientId,
            client_secret: clientSecret,
            code
        },
        {
            headers:{
                Accept:'application/json'
            }
        }

    )

    const accessToken = TokenRes.data.access_token;
    console.log("Access Token:", accessToken);

    const UserInfoRes = await axios.get("https://api.github.com/user",{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
    const user = UserInfoRes.data;

    // email res

    const emailRes = await axios.get("https://api.github.com/user/emails",{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })

    const emails = emailRes.data;  
    const userName = user.login;
    const userEmail = emails[0].email;

    const githubToken = jwt.sign({
        userName,
        userEmail
    } , jwtSecret , {expiresIn:'1d'})


    console.log("sending response to client")


    // responses->

    res.cookie("githubToken" , githubToken , {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 
    })
    console.log("cookie sent");
    res.redirect(process.env.ORIGIN || "http://localhost:5173");
    

   
})

// test route
app.get('/' , (req ,res)=>{
    res.send(
        '<div>' +
        '<h1>Oauth git</h1>' +
        '<a href="/auth/github">Login with GitHub</a>' +
        '</div>'
    )

})

// user verification + private repo
app.get("/private-repo", verify, async (req, res) => {
  try {
    console.log("fetching private repo----------");
    const { owner, repo } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        error: "Owner and repo query parameters are required",
      });
    }
    console.log("owner:", owner, "repo:", repo);
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    console.log("response:", response.data);
    
    res.json({ success: true, data: response.data });
  } catch (err) {
    if (err.response) {
      console.error("GitHub error:", err.response.data);
      res.status(err.response.status).json({
        success: false,
        message: "GitHub API error occuted error : "+ " " +err.response.data.message || "Failed to fetch repository",
      });
    } else if (err.request) {
      console.error("No response from GitHub:", err.request);
      res.status(502).json({
        success: false,
        message: "No response from GitHub API",
      });
    } else {
      console.error("Error fetching private repo:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error fetching private repo",
      });
    }
  }
});



// server 
app.listen(3000, () => {
    console.log('Server is ON ✅') 
})