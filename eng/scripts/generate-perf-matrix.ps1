param(
    [string]$BaseMatrixPath,
    [string]$OutputMatrixPath,
    [string]$Tests,
    [int]$TestBuckets
)

function toRegex([string]$str) {
    return "^$str$"
}

function GenerateMatrixFileWithSparseTests(
    [PSObject]$Matrix,
    [string]$OutputMatrixPath,
    [array]$TestsArray,
    [int]$TestBuckets
) {
    [array]$testRegexes = $TestsArray | ForEach-Object { toRegex $_ }
    $matrix.matrix | Add-Member -Name "Tests" -Value $testRegexes -MemberType NoteProperty
    $matrix | ConvertTo-Json -Depth 100 | Out-File $OutputMatrixPath
    Get-Content -Raw $OutputMatrixPath  # For local/pipeline debugging
}

function GenerateMatrixFileWithTestBuckets(
    [PSObject]$Matrix,
    [string]$OutputMatrixPath,
    [array]$TestsArray,
    [int]$TestBuckets
) {

    $bucketSizes = [int[]]::new($TestBuckets)
    for ($i = 0; $i -lt $TestsArray.Length; $i++) {
        $bucketSizes[$i % $TestBuckets]++
    }

    $testsArrayBucketed = [array[]]::new($TestBuckets)
    for ($bucketIndex = 0; $bucketIndex -lt $bucketSizes.Length; $bucketIndex++) {
        for($i = 0; $i -lt $bucketSizes[$bucketIndex]; $i++) {
            $item, $testsArray = $testsArray  # shift
            $testsArrayBucketed[$bucketIndex] += $item
        }
    }

    $testsRegexBucketed = $testsArrayBucketed | ForEach-Object { toRegex ($_ -join "|") }

    $matrix.matrix | Add-Member -Name "Tests" -Value $testsRegexBucketed -MemberType NoteProperty
    $matrix | ConvertTo-Json -Depth 100 | Out-File $OutputMatrixPath
    Get-Content -Raw $OutputMatrixPath  # For local/pipeline debugging
}

function GenerateMatrixFile(
    [string]$BaseMatrixPath,
    [string]$OutputMatrixPath,
    [string]$Tests,
    [int]$TestBuckets
) {
    # Convert as PSObject to retain sort order (so matrix job ordering/naming is deterministic)
    $matrix = Get-Content -Raw $BaseMatrixPath | ConvertFrom-Json -Depth 100
    [array]$testsArray = $Tests -split '[, ]' | Where-Object { $_ }

    if (($TestBuckets -gt 0) -and ($TestBuckets -lt $testsArray.Length)) {
        GenerateMatrixFileWithTestBuckets `
            -Matrix $matrix `
            -OutputMatrixPath $OutputMatrixPath `
            -Tests $testsArray `
            -TestBuckets $TestBuckets
    } else {
        GenerateMatrixFileWithSparseTests `
            -Matrix $matrix `
            -OutputMatrixPath $OutputMatrixPath `
            -Tests $testsArray `
            -TestBuckets $TestBuckets
    }
}

GenerateMatrixFile `
    -BaseMatrixPath $BaseMatrixPath `
    -OutputMatrixPath $OutputMatrixPath `
    -Tests $Tests `
    -TestBuckets $TestBuckets
