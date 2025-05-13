import React from "react";
import Grid from "@mui/material/Grid2";
import { Divider, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TandC() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          style={{ textAlign: "left" }}
        >
          Terms and Conditions
        </Typography>
      </Grid>
      <Grid
        item
        size={{ xs: 12, sm: 10, md: 12 }}
        style={{ textAlign: "left" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          By holding, using, or transferring a yarts NFT received via airdrop,
          you acknowledge and agree to these terms and conditions.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          2. Website as Interface
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          This website serves as an interface to facilitate the distribution of
          yarts NFTs and related transactions on the blockchain. The website
          itself is not stored on the blockchain, and Laid Back Ventures GmbH
          assumes no liability for issues arising directly from the blockchain
          or smart contract operations. By using this website, you consent to
          these terms.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          3. No Refunds or Exchanges
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Yarts NFTs provided via airdrop are final. They cannot be returned,
          refunded, or exchanged. They are provided "as-is" with no guarantees
          of future value or utility.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          4. Art Project Disclaimer
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          yarts is an art project. The NFTs represent a creative vision and may
          fluctuate in value based on market demand. The creators assume no
          responsibility for changes in value.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          5. Full Commercial Rights
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          As the owner of a yarts NFT, you have worldwide, unrestricted,
          royalty-free rights to use, reproduce, display, and create derivative
          works and products based on the specific artwork associated with your
          NFT (e.g., merchandise). These rights apply exclusively to the artwork
          tied to the NFT you own and do not imply ownership or control over any
          yarts branding, trademarks, or other intellectual property associated
          with Laid Back Ventures GmbH or the yarts collection.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          6. Blockchain and Transaction Risks
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          All transactions related to yarts are managed by blockchain
          technology. You accept the inherent risks of blockchain, including
          transaction failures, smart contract vulnerabilities, hacking, and
          potential loss of assets. Gas fees related to any blockchain actions
          may be non-refundable. Laid Back Ventures GmbH is not liable for any
          losses or transaction issues.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          7. Regulatory Uncertainty
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          The legal landscape of NFTs, cryptocurrencies, and blockchain
          technology is evolving. New regulations or legal interpretations may
          impact yarts NFTs and affect their ownership, value, or associated
          rights. By holding yarts NFTs, you acknowledge and accept these risks.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          8. Recipient’s Tax Responsibilities
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Recipients are solely responsible for determining and fulfilling any
          tax obligations related to the receipt, ownership, or sale of yarts
          NFTs in their jurisdiction. Laid Back Ventures GmbH does not provide
          tax advice and accepts no responsibility for any tax liabilities,
          including VAT, that may arise. Recipients are encouraged to consult a
          tax professional to understand their tax obligations.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          9. Transferability of Terms
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          These terms apply to all future yarts NFT owners. If you transfer your
          NFT, the recipient is bound by these terms.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          10. Risk of Third-Party Platforms
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Laid Back Ventures GmbH is not responsible for any issues or losses
          related to third-party marketplaces. You assume the risks of using
          such platforms to trade yarts NFTs.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          11. No Warranty
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          This website and its services are provided "as is" and "as available,"
          with no warranty of any kind. We do not guarantee uninterrupted,
          secure, or error-free access.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          12. Limitation of Liability
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Laid Back Ventures GmbH is not liable for any indirect, incidental,
          special, or consequential damages, including lost profits, related to
          the use or ownership of yarts NFTs.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          13. Force Majeure
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Laid Back Ventures GmbH is not liable for any failure to fulfill
          obligations due to events beyond our control, including natural
          disasters, war, cyber-attacks, or disruptions to the ApeChain or
          Ethereum networks.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          14. Dispute Resolution and Jurisdiction
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          These terms are governed by the laws of Germany. Any disputes arising
          from these terms will be handled exclusively by the courts in Munich,
          Germany.
        </Typography>
        <Divider sx={{ marginTop: 2 }} />
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          style={{ textAlign: "left" }}
        >
          Nutzungsbedingungen
        </Typography>
      </Grid>
      <Grid
        item
        size={{ xs: 12, sm: 10, md: 12 }}
        style={{ textAlign: "left" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          1. Annahme der Bedingungen
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Durch den Besitz, die Nutzung oder die Übertragung eines Yarts NFT,
          das via Airdrop erhalten wurde, erkennen Sie diese Nutzungsbedingungen
          an und stimmen ihnen zu.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          2. Website als Schnittstelle
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Diese Website dient als Schnittstelle zur Verteilung der Yarts NFTs
          und zugehöriger Transaktionen auf der Blockchain. Die Website selbst
          wird nicht auf der Blockchain gespeichert, und die Laid Back Ventures
          GmbH übernimmt keine Haftung für Probleme, die direkt aus der
          Blockchain oder dem Betrieb von Smart Contracts entstehen. Durch die
          Nutzung dieser Website erklären Sie sich mit diesen Bedingungen
          einverstanden.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          3. Keine Rückgabe oder Umtausch
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Yarts NFTs, die via Airdrop bereitgestellt werden, sind endgültig. Sie
          können nicht zurückgegeben, erstattet oder umgetauscht werden. Sie
          werden "wie gesehen" bereitgestellt, ohne Garantien für einen
          zukünftigen Wert oder eine spezifische Nutzung.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          4. Hinweis auf Kunstprojekt
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          yarts ist ein Kunstprojekt. Die NFTs repräsentieren eine kreative
          Vision und können im Wert je nach Marktnachfrage schwanken. Die
          Schöpfer übernehmen keine Verantwortung für Wertänderungen.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          5. Volle kommerzielle Rechte
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Als Inhaber eines Yarts NFT haben Sie weltweite, uneingeschränkte,
          gebührenfreie Rechte, das spezifische Kunstwerk, das Ihrem NFT
          zugeordnet ist, zu nutzen, zu reproduzieren, anzuzeigen und daraus
          abgeleitete Werke und Produkte (z. B. Merchandising) zu erstellen.
          Diese Rechte gelten ausschließlich für das Kunstwerk, das mit Ihrem
          NFT verbunden ist, und beinhalten keine Eigentums- oder Kontrollrechte
          an der Marke Yarts, den Markenrechten oder sonstigem geistigen
          Eigentum der Laid Back Ventures GmbH oder der Yarts-Kollektion.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          6. Risiken der Blockchain und Transaktionen
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Alle Transaktionen im Zusammenhang mit Yarts werden durch
          Blockchain-Technologie abgewickelt. Sie erkennen die inhärenten
          Risiken der Blockchain an, einschließlich Transaktionsfehlern,
          Schwachstellen in Smart Contracts, Hacking und dem möglichen Verlust
          von Vermögenswerten. Gebühren für Blockchain-Transaktionen (z. B. Gas
          Fees) können nicht erstattet werden. Die Laid Back Ventures GmbH
          haftet nicht für Verluste oder Transaktionsprobleme.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          7. Regulatorische Unsicherheiten
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Die rechtliche Landschaft von NFTs, Kryptowährungen und
          Blockchain-Technologie entwickelt sich ständig weiter. Neue
          Vorschriften oder rechtliche Auslegungen können sich auf Yarts NFTs
          auswirken und deren Besitz, Wert oder damit verbundene Rechte
          beeinträchtigen. Durch den Besitz von Yarts NFTs erkennen Sie diese
          Risiken an und akzeptieren sie.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          8. Steuerliche Pflichten der Empfänger
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Empfänger sind allein dafür verantwortlich, steuerliche
          Verpflichtungen im Zusammenhang mit dem Erhalt, dem Besitz oder dem
          Verkauf von Yarts NFTs in ihrer Gerichtsbarkeit zu bestimmen und zu
          erfüllen. Die Laid Back Ventures GmbH gibt keine Steuerberatung und
          übernimmt keine Verantwortung für steuerliche Verpflichtungen,
          einschließlich Mehrwertsteuer (USt.), die möglicherweise anfallen.
          Empfängern wird empfohlen, einen Steuerberater zu konsultieren, um
          ihre steuerlichen Verpflichtungen zu verstehen.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          9. Übertragbarkeit der Bedingungen
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Diese Bedingungen gelten für alle zukünftigen Inhaber eines Yarts NFT.
          Wenn Sie Ihr NFT übertragen, ist der Empfänger an diese Bedingungen
          gebunden.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          10. Risiken durch Drittplattformen
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Die Laid Back Ventures GmbH ist nicht verantwortlich für Probleme oder
          Verluste, die mit Drittanbieter-Marktplätzen verbunden sind. Sie
          tragen die Risiken der Nutzung solcher Plattformen für den Handel mit
          Yarts NFTs.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          11. Keine Garantie
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Diese Website und ihre Dienste werden "wie gesehen" und "wie
          verfügbar" bereitgestellt, ohne jegliche Garantie. Es wird keine
          unterbrechungsfreie, sichere oder fehlerfreie Nutzung garantiert.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          12. Haftungsbeschränkung
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Die Laid Back Ventures GmbH haftet nicht für indirekte, beiläufige,
          besondere oder Folgeschäden, einschließlich entgangener Gewinne, die
          sich aus der Nutzung oder dem Besitz von Yarts NFTs ergeben.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          13. Höhere Gewalt
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Die Laid Back Ventures GmbH haftet nicht für die Nichterfüllung von
          Verpflichtungen aufgrund von Ereignissen, die außerhalb unserer
          Kontrolle liegen, einschließlich Naturkatastrophen, Kriegen,
          Cyberangriffen oder Störungen in den Netzwerken von ApeChain oder
          Ethereum.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          14. Streitbeilegung und Gerichtsbarkeit
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Diese Bedingungen unterliegen deutschem Recht. Alle Streitigkeiten,
          die sich aus diesen Bedingungen ergeben, werden ausschließlich vor den
          Gerichten in München, Deutschland, verhandelt.
        </Typography>
        <Divider sx={{ marginTop: 2 }} />
      </Grid>
    </Grid>
  );
}
