<?php
function moveUploadedFile(string $directory, \Psr\Http\Message\UploadedFileInterface $uploadedFile): string
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    $filename = sprintf('%s.%0.8s', $basename, $extension);

    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
    return $filename;
}
