import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useApiAcceptInvitation} from "../../core/hooks/useApiAcceptInvitation";
import { JwtService } from "../../core/auth/JwtService";

function Invitation() {
    const { idInvitation } = useParams();
    const { acceptInvitation } = useApiAcceptInvitation();

    useEffect(() => {
        const jwtService = new JwtService();
        const rawAccessToken = jwtService.getAccessToken();
        acceptInvitation(idInvitation, rawAccessToken)
            .then(() => {
                console.log("Invitation accepted");
            }).catch(() => {
                console.log("Invitation not accepted");
            })
    }, [acceptInvitation, idInvitation]);

    return (
      <>
          <h1>Invitation</h1>
      </>
    );
}

export default Invitation