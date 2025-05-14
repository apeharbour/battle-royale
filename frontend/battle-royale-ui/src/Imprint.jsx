import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CircleIcon from "@mui/icons-material/Circle";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EventIcon from "@mui/icons-material/Event";
import GavelIcon from "@mui/icons-material/Gavel";
import { useTheme } from "@mui/material/styles";

export default function Imprint() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Legal Notice
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Information in accordance with §5 of the E-Commerce Act, §14 of the
          Unternehmensgesetzbuch, §63 of the Commercial Code and disclosure
          requirements under §25 of the Media Act.
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Laid Back Ventures GmbH
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Cosimastr. 121
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          81925 München
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Germany
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          <span style={{ fontWeight: 700 }}>Email:</span> info@laidback.ventures
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <span style={{ fontWeight: 700 }}>
            Contact details of the data protection controller
          </span>
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you have any question about data protection, please find the
          contact details of the body responsible for data protection below:
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Laid Back Ventures GmbH
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Cosimastr. 121
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          81925 München
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Germany
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          <span style={{ fontWeight: 700 }}>Email:</span> info@laidback.ventures
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          All texts are copyrighted.
        </Typography>
      </Grid>
      <Grid item size={12}>
        <Typography
          variant="h5"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Privacy Policy
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          We have written this privacy policy (version 21.09.2021-311832766) in
          order to explain to you, in accordance with the provisions of the
          General Data Protection Regulation (EU) 2016/679 and applicable
          national laws, which personal data (data for short) we as the
          controller – and the processors commissioned by us (e.g. providers) –
          process, will process in the future and what legal options you have.
          The terms used are to be considered as gender-neutral.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <span style={{ fontWeight: 700 }}>In short:</span> We provide you with
          comprehensive information about any personal data we process about
          you. Privacy policies usually sound very technical and use legal
          terminology. However, this privacy policy is intended to describe the
          most important things to you as simply and transparently as possible.
          So long as it aids transparency,{" "}
          <span style={{ fontWeight: 700 }}>
            technical terms are explained in a reader-friendly manner, links
          </span>{" "}
          to further information are provided and{" "}
          <span style={{ fontWeight: 700 }}>graphics</span> are used. We are
          thus informing in clear and simple language that we only process
          personal data in the context of our business activities if there is a
          legal basis for it. This is certainly not possible with brief, unclear
          and legal-technical statements, as is often standard on the Internet
          when it comes to data protection. I hope you find the following
          explanations interesting and informative. Maybe you will also find
          some information that you have not been familiar with. If you still
          have questions, we would like to ask you to contact the responsible
          body named below or in the imprint, to follow the existing links and
          to look at further information on third-party sites. You can of course
          also find our contact details in the imprint.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Scope
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          This privacy policy applies to all personal data processed by our
          company and to all personal data processed by companies commissioned
          by us (processors). With the term personal data, we refer to
          information within the meaning of Article 4 No. 1 GDPR, such as the
          name, email address and postal address of a person. The processing of
          personal data ensures that we can offer and invoice our services and
          products, be it online or offline. The scope of this privacy policy
          includes:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="All online presences (websites, online shops) that we operate" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Social media presences and email communication" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Mobile apps for smartphones and other devices" />
          </ListItem>
        </List>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <span style={{ fontWeight: 700 }}>In short:</span> This privacy policy
          applies to all areas in which personal data is processed in a
          structured manner by the company via the channels mentioned. Should we
          enter into legal relations with you outside of these channels, we will
          inform you separately if necessary.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Legal bases
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          In the following privacy policy, we provide you with transparent
          information on the legal principles and regulations, i.e. the legal
          bases of the General Data Protection Regulation, which enable us to
          process personal data.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Whenever EU law is concerned, we refer to REGULATION (EU) 2016/679 OF
          THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of April 27, 2016. You can
          of course access the General Data Protection Regulation of the EU
          online at EUR-Lex, the gateway to EU law, at&nbsp;
          <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32016R0679">
            https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32016R0679
          </a>
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          We only process your data if at least one of the following conditions
          applies:
        </Typography>
        <List>
          <ListItem>
            <Typography
              component="div"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              <Box fontWeight="700" display="inline">
                1. Consent
              </Box>{" "}
              (Article 6 Paragraph 1 lit. a GDPR): You have given us your
              consent to process data for a specific purpose. An example would
              be the storage of data you entered into a contact form.
            </Typography>
          </ListItem>

          <ListItem>
            <Typography
              component="div"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              <Box fontWeight="700" display="inline">
                2. Contract
              </Box>{" "}
              (Article 6 Paragraph 1 lit. b GDPR): We process your data in order
              to fulfill a contract or pre-contractual obligations with you. For
              example, if we conclude a sales contract with you, we need
              personal information in advance.
            </Typography>
          </ListItem>

          <ListItem>
            <Typography
              component="div"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              <Box fontWeight="700" display="inline">
                3. Legal obligation
              </Box>{" "}
              (Article 6 Paragraph 1 lit. c GDPR): If we are subject to a legal
              obligation, we will process your data. For example, we are legally
              required to keep invoices for our bookkeeping. These usually
              contain personal data.
            </Typography>
          </ListItem>

          <ListItem>
            <Typography
              component="div"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              <Box fontWeight="700" display="inline">
                4. Legitimate interests
              </Box>{" "}
              (Article 6 Paragraph 1 lit. f GDPR): In the case of legitimate
              interests that do not restrict your basic rights, we reserve the
              right to process personal data. For example, we have to process
              certain data in order to be able to operate our website securely
              and economically. Therefore, the processing is a legitimate
              interest.
            </Typography>
          </ListItem>
        </List>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Other conditions such as making recordings in the interest of the
          public, the exercise of official authority as well as the protection
          of vital interests do not usually occur with us. Should such a legal
          basis be relevant, it will be disclosed in the appropriate place. In
          addition to the EU regulation, national laws also apply:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              In <strong style={{ fontWeight: 700 }}>Austria</strong> this is
              the{" "}
              <strong style={{ fontWeight: 700 }}>
                Austrian Data Protection Act
              </strong>{" "}
              (<strong style={{ fontWeight: 700 }}>Datenschutzgesetz</strong>),
              in short <strong style={{ fontWeight: 700 }}>DSG</strong>.
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              In <strong style={{ fontWeight: 700 }}>Germany</strong> this is
              the{" "}
              <strong style={{ fontWeight: 700 }}>
                Federal Data Protection Act
              </strong>{" "}
              (
              <strong style={{ fontWeight: 700 }}>
                Bundesdatenschutzgesetz
              </strong>
              ), in short <strong style={{ fontWeight: 700 }}>BDSG</strong>.
            </Typography>
          </ListItem>
        </List>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Should other regional or national laws apply, we will inform you about
          them in the following sections.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Contact details of the data protection controller
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you have any questions about data protection, you will find the
          contact details of the responsible person or controller below:
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Laid Back Ventures GmbH
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Cosimastr. 121
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          81925 München
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Germany
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          Authorised to represent:
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "left" }}>
          <span style={{ fontWeight: 700 }}>Email:</span> info@laidback.ventures
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Storage Period
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          It is a general criterion for us to store personal data only for as
          long as is absolutely necessary for the provision of our services and
          products. This means that we delete personal data as soon as any
          reason for the data processing no longer exists. In some cases, we are
          legally obliged to keep certain data stored even after the original
          purpose no longer exists, such as for accounting purposes. If you want
          your data to be deleted or if you want to revoke your consent to data
          processing, the data will be deleted as soon as possible, provided
          there is no obligation to continue its storage. We will inform you
          below about the specific duration of the respective data processing,
          provided we have further information.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Rights in accordance with the General Data Protection Regulation
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          You are granted the following rights in accordance with the provisions
          of the GDPR (General Data Protection Regulation) and the Austrian Data
          Protection Act (DSG):
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1">
              Right to rectification (Article 16 GDPR)
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Right to erasure (“right to be forgotten”) (Article 17 GDPR)
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Right to restrict processing (Article 18 GDPR)
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Right to notification – notification obligation regarding
              rectification or erasure of personal data or restriction of
              processing (Article 19 GDPR)
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Right to data portability (Article 20 GDPR)
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Right to object (Article 21 GDPR)
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Right not to be subject to a decision based solely on automated
              processing – including profiling – (Article 22 GDPR)
            </Typography>
          </ListItem>
        </List>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you think that the processing of your data violates the data
          protection law, or that your data protection rights have been
          infringed in any other way, you can lodge a complaint with your
          respective regulatory authority. For Austria this is the data
          protection authority, whose website you can access at{" "}
          <a href="https://www.data-protection-authority.gv.at/">
            https://www.data-protection-authority.gv.at/
          </a>
          .
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Bayern Data protection authority
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <strong>State Commissioner for Data Protection:</strong> Prof. Dr.
          Thomas Petri
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <strong>Address:</strong> Wagmüllerstr. 18, 80538 München
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <strong>Phone number:</strong> 089/21 26 72-0
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <strong>E-mail address:</strong> poststelle@datenschutz-bayern.de
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <strong>Website:</strong>{" "}
          <a href="https://www.datenschutz-bayern.de/">
            https://www.datenschutz-bayern.de/
          </a>
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Data transfer to third countries
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          We only transfer or process data to countries outside the EU (third
          countries) if you consent to this processing, if this is required by
          law or if it is contractually necessary. In any case, we generally
          only do so to the permitted extent. In most cases, your consent is the
          most important reason for data being processed in third countries.
          When personal data is being processed in third countries such as the
          USA, where many software manufacturers offer their services and have
          their servers located, your personal data may be processed and stored
          in unexpected ways. We want to expressly point out, that according to
          the European Court of Justice, there is currently no adequate level of
          protection for data transfer to the USA. Data processing by US
          services (such as Google Analytics) may result in data processing and
          retention without the data having undergone anonymisation processes.
          Furthermore, US government authorities may be able to access
          individual data. The collected data may also get linked to data from
          other services of the same provider, should you have a user account
          with the respective provider. We try to use server locations within
          the EU, whenever this is offered and possible. We will provide you
          with more details about data transfer to third countries in the
          appropriate sections of this privacy policy, whenever applicable.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Security of data processing operations
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          In order to protect personal data, we have implemented both technical
          and organisational measures. We encrypt or pseudonymise personal data
          wherever this is possible. Thus, we make it as difficult as we can for
          third parties to extract personal information from our data.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Article 25 of the GDPR refers to “data protection by technical design
          and by data protection-friendly default” which means that both
          software (e.g. forms) and hardware (e.g. access to server rooms)
          appropriate safeguards and security measures shall always be placed.
          If applicable, we will outline the specific measures below.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          TLS encryption with https
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          The terms TLS, encryption and https sound very technical, which they
          are indeed. We use HTTPS (Hypertext Transfer Protocol Secure) to
          securely transfer data on the Internet. This means that the entire
          transmission of all data from your browser to our web server is
          secured – nobody can “listen in”. We have thus introduced an
          additional layer of security and meet privacy requirements through
          technology design Article 25 Section 1 GDPR). With the use of TLS
          (Transport Layer Security), which is an encryption protocol for safe
          data transfer on the internet, we can ensure the protection of
          confidential information.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          You can recognise the use of this safeguarding tool by the little
          lock-symbol <LockIcon fontSize="small" />, which is situated in your
          browser’s top left corner in the left of the internet address (e.g.
          examplepage.uk), as well as by the display of the letters https
          (instead of http) as a part of our web address.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you want to know more about encryption, we recommend you to do a
          Google search for "Hypertext Transfer Protocol Secure wiki" to find
          good links to further information.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Communications
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Communications Overview
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <PeopleIcon fontSize="small" /> Affected parties: Anyone who
          communicates with us via phone, email, or online form
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <DescriptionIcon fontSize="small" /> Processed data: e.g., telephone
          number, name, email address, or data entered in forms. You can find
          more details on this under the respective form of contact
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <HandshakeIcon fontSize="small" /> Purpose: handling communication
          with customers, business partners, etc.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <EventIcon fontSize="small" /> Storage duration: for the duration of
          the business case and the legal requirements
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <GavelIcon fontSize="small" /> Legal basis: Article 6 (1) (a) GDPR
          (consent), Article 6 (1) (b) GDPR (contract), Article 6 (1) (f) GDPR
          (legitimate interests)
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you contact us and communicate with us via phone, email or online
          form, your personal data may be processed. The data will be processed
          for handling and processing your request and for the related business
          transaction. The data is stored for this period of time or for as long
          as is legally required.
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Affected persons
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          The above-mentioned processes affect all those who seek contact with
          us via the communication channels we provide.
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Telephone
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          When you call us, the call data is stored in a pseudonymised form on
          the respective terminal device, as well as by the telecommunications
          provider that is being used. In addition, data such as your name and
          telephone number may be sent via email and stored for answering your
          inquiries. The data will be erased as soon as the business case has
          ended and the legal requirements allow for its erasure.
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Email
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you communicate with us via email, your data is stored on the
          respective terminal device (computer, laptop, smartphone, …) as well
          as on the email server. The data will be deleted as soon as the
          business case has ended and the legal requirements allow for its
          erasure.
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Online forms
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          If you communicate with us using an online form, your data is stored
          on our web server and, if necessary, forwarded to our email address.
          The data will be erased as soon as the business case has ended and the
          legal requirements allow for its erasure.
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Legal bases
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Data processing is based on the following legal bases:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Art. 6 para. 1 lit. a GDPR (consent): You give us your consent to
              store your data and to continue to use it for the purposes of the
              business case;
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Art. 6 para. 1 lit. b GDPR (contract): For the performance of a
              contract with you or a processor such as a telephone provider, or
              if we have to process the data for pre-contractual activities,
              such as preparing an offer;
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Art. 6 para. 1 lit. f GDPR (legitimate interests): We want to
              conduct our customer inquiries and business communication in a
              professional manner. Thus, certain technical facilities such as
              email programs, Exchange servers, and mobile network operators are
              necessary to efficiently operate our communications.
            </Typography>
          </ListItem>
        </List>
      </Grid>
      <Grid item size={12}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Web hosting
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Web hosting Overview
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <PeopleIcon fontSize="small" /> Affected parties: visitors to the
          website
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <DescriptionIcon fontSize="small" /> Processed data: IP address, time
          of website visit, browser used and other data. You can find more
          details on this below or at the respective web hosting provider.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <HandshakeIcon fontSize="small" />
          Purpose: professional hosting of the website and security of
          operations
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <EventIcon fontSize="small" /> Storage period: dependent on the
          respective provider, but usually 2 weeks
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <GavelIcon fontSize="small" /> Legal basis: Art. 6 para. 1 lit. f GDPR
          (legitimate interests)
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          What is web hosting?
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Every time you visit a website nowadays, certain information –
          including personal data – is automatically created and stored,
          including on this website. This data should be processed as sparingly
          as possible, and only with good reason. By website, we mean the
          entirety of all websites on your domain, i.e. everything from the
          homepage to the very last subpage (like this one here). By domain we
          mean example.uk or examplepage.com.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          When you want to view a website on a screen, you use a program called
          a web browser. You probably know the names of some web browsers:
          Google Chrome, Microsoft Edge, Mozilla Firefox, and Apple Safari.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          The web browser has to connect to another computer which stores the
          website’s code: the web server. Operating a web server is complicated
          and time-consuming, which is why this is usually done by professional
          providers. They offer web hosting and thus ensure the reliable and
          flawless storage of website data.
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Whenever the browser on your computer establishes a connection
          (desktop, laptop, smartphone) and whenever data is being transferred
          to and from the web server, personal data may be processed. After all,
          your computer stores data, and the web server also has to retain the
          data for a period of time in order to ensure it can operate properly.
        </Typography>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Why do we process personal data?
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          The purposes of data processing are:
        </Typography>
        <List>
          <ListItem>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              1. Professional hosting of the website and operational security.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              2. To maintain the operational as well as IT security.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              3. Anonymous evaluation of access patterns to improve our offer,
              and if necessary, for prosecution or the pursuit of claims.
            </Typography>
          </ListItem>
        </List>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Which data are processed?
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Even while you are visiting our website, our web server, that is the
          computer on which this website is saved, usually automatically saves
          data such as:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              The full address (URL) of the accessed website (e.g.,
              https://www.examplepage.uk/examplesubpage.html?tid=311832766)
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              Browser and browser version (e.g., Chrome 87)
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              The operating system used (e.g., Windows 10)
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              The address (URL) of the previously visited page (referrer URL)
              (e.g., https://www.examplepage.uk/icamefromhere.html/)
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              The host name and the IP address of the device from which the
              website is being accessed (e.g., COMPUTERNAME and 194.23.43.121)
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="subtitle1">Date and time</Typography>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography
              variant="subtitle1"
              sx={{
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              In so-called web server log files
            </Typography>
          </ListItem>
        </List>
        <Typography
          variant="body1"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          How long is the data stored?
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Generally, the data mentioned above are stored for two weeks and are
          then automatically deleted. We do not pass these data on to others,
          but we cannot rule out the possibility that this data may be viewed by
          the authorities in the event of illegal conduct.
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          In short:
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          Your visit is logged by our provider (company that runs our website on
          special computers (servers)), but we do not pass on your data without
          your consent!
        </Typography>
      </Grid>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{ fontWeight: 700 }}
        >
          Legal basis
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          The lawfulness of processing personal data in the context of web
          hosting is justified in Art. 6 para. 1 lit. f GDPR (safeguarding of
          legitimate interests), as the use of professional hosting with a
          provider is necessary to present the company in a safe and
          user-friendly manner on the internet, as well as to have the ability
          to track any attacks and claims, if necessary.
        </Typography>
      </Grid>
      <Grid item size={12}>
        <Typography
          variant="h6"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            fontWeight: 700,
          }}
        >
          Amazon Web Services (AWS) Privacy Policy
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left" }}
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          We use Amazon Web Services (AWS) for our website, which is a web
          hosting provider, among other things. The provider of this service is
          the American company Amazon Web Services, Inc., 410 Terry Avenue
          North, Seattle WA 98109, USA. Amazon Web Services (AWS) also processes
          data in the USA, among other countries. We would like to note, that
          according to the European Court of Justice, there is currently no
          adequate level of protection for data transfers to the USA. This can
          be associated with various risks to the legality and security of data
          processing. Amazon Web Services (AWS) uses standard contractual
          clauses approved by the EU Commission as the basis for data processing
          by recipients based in third countries (outside the European Union,
          Iceland, Liechtenstein, Norway, and especially in the USA) or data
          transfer there (= Art. 46, paragraphs 2 and 3 of the GDPR). These
          clauses oblige Amazon Web Services (AWS) to comply with the EU‘s level
          of data protection when processing relevant data outside the EU. These
          clauses are based on an implementing order by the EU Commission. You
          can find the order and the clauses here:{" "}
          <a
            href="https://ec.europa.eu/commission/presscorner/detail/en/ip_21_2847"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/commission/presscorner/detail/en/ip_21_2847
          </a>
          . You can find out more about the data that are processed through the
          use of Amazon Web Services (AWS) in their Privacy Policy at{" "}
          <a
            href="https://aws.amazon.com/privacy/?nc1=h_ls"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://aws.amazon.com/privacy/?nc1=h_ls
          </a>
          . All texts are copyrighted.
        </Typography>
      </Grid>
    </Grid>
  );
}
