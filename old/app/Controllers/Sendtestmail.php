<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class Sendtestmail extends Controller
{
    public function index()
    {
        $log = [];
        $log[] = '<h2>🔧 Test Envoi Email — CodeIgniter 4</h2>';

        // --- Chargement config ---
        $log[] = '<h3>📋 Étape 1 : Chargement de la configuration</h3>';
        try {
            $emailConfig = config('Email');
            $log[] = '✅ Config chargée depuis app/Config/Email.php';
            $log[] = '<pre>'
                . 'Protocol  : ' . $emailConfig->protocol   . "\n"
                . 'SMTPHost  : ' . $emailConfig->SMTPHost   . "\n"
                . 'SMTPPort  : ' . $emailConfig->SMTPPort   . "\n"
                . 'SMTPCrypto: ' . $emailConfig->SMTPCrypto . "\n"
                . 'SMTPUser  : ' . $emailConfig->SMTPUser   . "\n"
                . 'MailType  : ' . $emailConfig->mailType   . "\n"
                . '</pre>';
        } catch (\Throwable $e) {
            $log[] = '❌ Erreur chargement config : ' . $e->getMessage();
            return $this->renderLog($log);
        }

        // --- Instanciation service email ---
        $log[] = '<h3>📬 Étape 2 : Instanciation du service Email</h3>';
        try {
            $email = \Config\Services::email();
            $log[] = '✅ Service email instancié';
        } catch (\Throwable $e) {
            $log[] = '❌ Impossible d\'instancier le service email : ' . $e->getMessage();
            return $this->renderLog($log);
        }

        // --- Paramétrage du message ---
        $log[] = '<h3>✉️ Étape 3 : Paramétrage du message</h3>';
        try {
            $from    = $emailConfig->fromEmail ?? 'noreply@mondomain.fr';
            $fromName = $emailConfig->fromName ?? 'Administrator';
            
          // 👈 Changez ici
            $to      = 'mailreceiver@host.com'; // 👈 Changez ici

            $email->setFrom($from, $fromName);
            $log[] = "✅ From     : {$from} ({$fromName})";

            $email->setTo($to);
            $log[] = "✅ To       : {$to}";

            $email->setSubject('Test Email — CodeIgniter 4 / OVH SMTP');
            $log[] = '✅ Subject  : Test Email — CodeIgniter 4 / OVH SMTP';

            $email->setMessage('<h3>Email de test</h3><p>Si vous recevez ceci, la configuration SMTP fonctionne correctement.</p>');
            $log[] = '✅ Message  : défini (HTML)';
        } catch (\Throwable $e) {
            $log[] = '❌ Erreur paramétrage message : ' . $e->getMessage();
            return $this->renderLog($log);
        }

        // --- Envoi ---
        $log[] = '<h3>🚀 Étape 4 : Envoi</h3>';
        try {
            $sent = $email->send(false); // false = ne pas vider le debugger
            if ($sent) {
                $log[] = '<span style="color:green;font-weight:bold">✅ Email envoyé avec succès !</span>';
            } else {
                $log[] = '<span style="color:red;font-weight:bold">❌ Échec de l\'envoi (send() retourne false)</span>';
            }
        } catch (\Throwable $e) {
            $log[] = '❌ Exception lors de send() : <strong>' . $e->getMessage() . '</strong>';
        }

        // --- Debug SMTP ---
        $log[] = '<h3>🔍 Étape 5 : Debug SMTP</h3>';
        $debugOutput = $email->printDebugger(['headers', 'subject', 'body']);
        $log[] = '<pre style="background:#f4f4f4;padding:10px;font-size:12px">'
               . htmlspecialchars($debugOutput)
               . '</pre>';

        return $this->renderLog($log);
    }

    // ---------------------------------------------------
    private function renderLog(array $lines): string
    {
        $html = implode("\n", $lines);
        return <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Sendtestmail</title>
            <style>
                body { font-family: monospace; margin: 30px; line-height: 1.7; }
                h2   { color: #333; }
                h3   { color: #555; border-bottom: 1px solid #ddd; }
                pre  { background: #f4f4f4; padding: 10px; border-radius: 4px; }
            </style>
        </head>
        <body>{$html}</body>
        </html>
        HTML;
    }
}
