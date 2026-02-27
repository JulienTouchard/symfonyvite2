<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TrucController extends AbstractController
{
    #[Route('/truc', name: 'app_truc')]
    public function index(): Response
    {
        return $this->render('truc/index.html.twig', [
            'controller_name' => 'TrucController',
        ]);
    }
}
