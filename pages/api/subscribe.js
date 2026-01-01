export default async (req, res) => {
  const { email } = req.body;
  if (email && email !== "") {
    try {
      const response = await fetch(
        "https://api.sendgrid.com/v3/marketing/contacts",
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
          body: JSON.stringify({
            list_ids: ["7951a379-c150-4fcc-91b5-ad23ff929e74"],
            contacts: [
              {
                email: email,
              },
            ],
          }),
        }
      );

      //

      if (response.status === 200 || response.status === 202) {
        res.statusCode = 200;
        res.json({ message: "Email id is accepted." });
        res.end();
      } else {
        res.statusCode = 400;
        res.json({ message: "Some problem occured!" });
        res.end();
      }
    } catch {
      res.statusCode = 400;
      res.json({ error: "Some problem occured!" });
    }
  } else {
    res.statusCode = 403;
    res.json({ error: "This is not allowed!" });
  }
};
