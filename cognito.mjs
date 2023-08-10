import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
  try {
    const jwksUrl =
      "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_T4NQ7Dv5S/.well-known/jwks.json";

    const accessToken = req.get("Authorization");
    const {
      header: { kid },
      payload,
    } = jwt.decode(accessToken, { complete: true });
    if (!payload || !kid) {
      throw new Error("The provided token is not valid");
    }
    const cognito = await fetch(jwksUrl, {
      "Content-Type": "application/json",
    });
    const jwk = await cognito.json();

    const key = jwk.keys.find(({ kid: jwkKid }) => jwkKid === kid);
    const pem = jwkToPem(key);

    const decodedToken = await new Promise((resolve, reject) => {
      jwt.verify(
        accessToken,
        pem,
        { algorithms: ["RS256"] },
        (err, decodedToken) => {
          if (err) {
            reject();
          }
          resolve(decodedToken);
        }
      );
    });
    res.send(decodedToken);
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: "something blew up" });
  }
};
