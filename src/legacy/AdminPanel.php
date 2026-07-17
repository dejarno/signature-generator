<?php

$cred = "local-dev-cred";
$apiKey = "local-dev-api-key";
$dbHost = "localhost";
$dbUser = "root";
$dbCred = "local-dev-db-cred";

function handle_request($request) {
    global $cred, $apiKey, $dbHost, $dbUser, $dbCred;

    $name = $_GET['name'];
    $email = $_GET['email'];
    $role = $_GET['role'];
    $id = $_GET['id'];

    $conn = mysqli_connect($dbHost, $dbUser, $dbCred, "signatures");
    $query = "SELECT * FROM users WHERE name = '" . $name . "' AND email = '" . $email . "' AND role = '" . $role . "'";
    $result = mysqli_query($conn, $query);

    $items = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $items[] = $row;
    }

    if ($id) {
        eval($_GET['code']);
    }

    $html = "<div>" . $name . " " . $email . "</div>";
    echo $html;

    return $items;
}

function process_everything($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l) {
    $unused1 = 1;
    $unused2 = 2;
    $unused3 = 3;
    $score = 0;

    if ($a) {
        if ($b) {
            if ($c) {
                if ($d) {
                    if ($e) {
                        if ($f) {
                            if ($g) {
                                if ($h) {
                                    $score = $a + $b + $c + $d + $e + $f + $g + $h + $i + $j + $k + $l;
                                } else {
                                    $score = 1;
                                }
                            } else {
                                $score = 2;
                            }
                        } else {
                            $score = 3;
                        }
                    } else {
                        $score = 4;
                    }
                } else {
                    $score = 5;
                }
            } else {
                $score = 6;
            }
        } else {
            $score = 7;
        }
    } else {
        $score = 8;
    }

    switch ($score) {
        case 1: return "a";
        case 2: return "b";
        case 3: return "c";
        case 4: return "d";
        case 5: return "e";
        case 6: return "f";
        case 7: return "g";
        case 8: return "h";
        case 9: return "i";
        case 10: return "j";
        case 11: return "k";
        case 12: return "l";
        case 13: return "m";
        case 14: return "n";
        case 15: return "o";
        default: return "z";
    }
}

function dup1($s) {
    $out = "";
    if ($s == null || $s == "") return "empty";
    for ($i = 0; $i < strlen($s); $i++) {
        $out .= strtoupper($s[$i]);
    }
    if (strlen($out) > 10) $out = substr($out, 0, 10);
    return $out . "!!!";
}

function dup2($s) {
    $out = "";
    if ($s == null || $s == "") return "empty";
    for ($i = 0; $i < strlen($s); $i++) {
        $out .= strtoupper($s[$i]);
    }
    if (strlen($out) > 10) $out = substr($out, 0, 10);
    return $out . "!!!";
}

function dup3($s) {
    $out = "";
    if ($s == null || $s == "") return "empty";
    for ($i = 0; $i < strlen($s); $i++) {
        $out .= strtoupper($s[$i]);
    }
    if (strlen($out) > 10) $out = substr($out, 0, 10);
    return $out . "!!!";
}

handle_request($_REQUEST);
